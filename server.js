const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const ORDER_SEQUENCE_FILE =
  path.join(
    DATA_DIR,
    'order-sequence.json'
  );


fs.mkdirSync(DATA_DIR, { recursive: true });

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(
    ORDERS_FILE,
    '[]',
    'utf8'
  );
}

const allowedOrigins =
  String(
    process.env.FRONTEND_ORIGIN || ''
  )
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);


/* ============================================================
   CORS
============================================================ */

app.use(
  cors({
    origin(origin, callback) {

      /*
       * Autorise les requêtes sans Origin
       * ainsi que les origines déclarées.
       */
      if (
        !origin ||
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin)
      ) {

        return callback(
          null,
          true
        );
      }

      return callback(
        new Error(
          'Origin non autorisée par CORS.'
        )
      );
    }
  })
);


/* ============================================================
   MIDDLEWARES
============================================================ */

app.use(
  express.json({
    limit: '1mb'
  })
);

/* ============================================================
   LOGS FRONTEND ↔ BACKEND
============================================================ */

function formatLogData(
  data
) {

  try {

    return JSON.stringify(
      data,
      null,
      2
    );

  } catch (error) {

    return String(
      data
    );

  }

}


app.use(
  (req, res, next) => {

    /*
     * Journalise uniquement les appels API.
     * Les fichiers HTML / CSS / JS ne sont donc pas affichés.
     */

    if (
      !req.originalUrl.startsWith(
        '/api/'
      )
    ) {

      return next();

    }


    const requestTime =
      nowISO();


    console.log(
      '\n============================================================'
    );

    console.log(
      `[${requestTime}] FRONTEND → BACKEND`
    );

    console.log(
      `Méthode : ${req.method}`
    );

    console.log(
      `Route   : ${req.originalUrl}`
    );

    console.log(
      `Origin  : ${req.headers.origin || 'inconnue'}`
    );


    /*
     * Affiche le contenu envoyé par le frontend
     * pour les requêtes contenant des données.
     */

    if (
      [
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
      ].includes(
        req.method
      ) &&
      req.body &&
      typeof req.body === 'object'
    ) {

      console.log(
        'Données reçues :'
      );

      console.log(
        formatLogData(
          req.body
        )
      );

    }


    /*
     * Intercepte res.json()
     * afin d'afficher la réponse exacte du backend.
     */

    let responseLogged =
      false;


    const originalJson =
      res.json.bind(
        res
      );


    res.json =
      (body) => {

        responseLogged =
          true;


        console.log(
          `BACKEND → FRONTEND [HTTP ${res.statusCode}]`
        );

        console.log(
          'Réponse envoyée :'
        );

        console.log(
          formatLogData(
            body
          )
        );

        console.log(
          '============================================================\n'
        );


        return originalJson(
          body
        );

      };


    /*
     * Sécurité supplémentaire :
     * affiche également le statut si la réponse
     * n'utilise pas res.json().
     */

    res.on(
      'finish',
      () => {

        if (
          !responseLogged
        ) {

          console.log(
            `BACKEND → FRONTEND [HTTP ${res.statusCode}]`
          );

          console.log(
            'Réponse terminée sans res.json().'
          );

          console.log(
            '============================================================\n'
          );

        }

      }
    );


    return next();

  }
);

app.use(
  express.static(
    path.join(
      __dirname,
      'public'
    )
  )
);


/* ============================================================
   PERSISTANCE JSON
============================================================ */

function readOrders() {

  try {

    const raw =
      fs.readFileSync(
        ORDERS_FILE,
        'utf8'
      );

    const data =
      JSON.parse(
        raw
      );

    return Array.isArray(data)
      ? data
      : [];

  } catch (error) {

    console.error(
      'Lecture orders.json impossible :',
      error
    );

    return [];
  }
}


function writeOrders(
  orders
) {

  const tempFile =
    `${ORDERS_FILE}.tmp`;

  fs.writeFileSync(
    tempFile,
    JSON.stringify(
      orders,
      null,
      2
    ),
    'utf8'
  );

  fs.renameSync(
    tempFile,
    ORDERS_FILE
  );
}


function nowISO() {

  return new Date().toISOString();

}

/* ============================================================
   SÉQUENCE DES IDENTIFIANTS DE COMMANDE
============================================================ */

function reserveNextOrderId() {

  const currentYear =
    new Date().getFullYear();


  let sequence =
    0;


  /*
   * Lecture de la séquence précédemment réservée.
   */

  try {

    if (
      fs.existsSync(
        ORDER_SEQUENCE_FILE
      )
    ) {

      const raw =
        fs.readFileSync(
          ORDER_SEQUENCE_FILE,
          'utf8'
        );


      const state =
        JSON.parse(
          raw
        );


      if (
        Number(state?.year) ===
        currentYear
      ) {

        sequence =
          Number(
            state.sequence
          ) || 0;

      }

    }

  } catch (error) {

    console.error(
      'Lecture de order-sequence.json impossible :',
      error
    );

  }


  /*
   * Sécurité :
   * on compare également avec les commandes
   * déjà présentes dans orders.json.
   */

  const orders =
    readOrders();


  const maxExistingSequence =
    orders.reduce(
      (
        max,
        order
      ) => {

        const match =
          String(
            order?.orderId || ''
          ).match(
            new RegExp(
              `^CMD-${currentYear}-(\\d+)$`
            )
          );


        if (!match) {
          return max;
        }


        return Math.max(
          max,
          Number(
            match[1]
          )
        );

      },
      0
    );


  sequence =
    Math.max(
      sequence,
      maxExistingSequence
    );


  /*
   * Réservation du prochain numéro.
   */

  sequence += 1;


  fs.writeFileSync(
    ORDER_SEQUENCE_FILE,
    JSON.stringify(
      {
        year:
          currentYear,

        sequence
      },
      null,
      2
    ),
    'utf8'
  );


  const orderId =
    `CMD-${currentYear}-${String(
      sequence
    ).padStart(
      5,
      '0'
    )}`;


  console.log(
    `[${nowISO()}] ID COMMANDE RÉSERVÉ : ${orderId}`
  );


  return orderId;

}


/* ============================================================
   FACTURE
============================================================ */

function generateInvoiceNumber(
  orderId
) {

  const suffix =
    String(
      orderId || ''
    ).replace(
      /^CMD-/,
      ''
    );

  return `FAC-${suffix}`;

}


/* ============================================================
   EMPREINTE TICKET
============================================================ */

/*
 * Même fonction de fingerprint
 * que celle utilisée par le frontend.
 *
 * Elle doit rester strictement identique
 * pour permettre au serveur de recalculer
 * la preuve du ticket.
 */

function generateOrderFingerprint(
  input
) {

  let hash =
    2166136261;

  for (
    let i = 0;
    i < input.length;
    i += 1
  ) {

    hash ^=
      input.charCodeAt(i);

    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return (
    hash >>> 0
  )
    .toString(36)
    .toUpperCase()
    .padStart(
      7,
      '0'
    )
    .slice(-7);
}


/* ============================================================
   EXTRACTION / NORMALISATION
============================================================ */

function normalizeOrderPayload(
  payload
) {

  if (
    !payload ||
    typeof payload !== 'object'
  ) {

    throw new Error(
      'Payload de commande absent ou invalide.'
    );
  }


  const required = [

    [
      'orderId',
      payload.orderId
    ],

    [
      'uniqueCode',
      payload.uniqueCode
    ],

    [
      'createdAt',
      payload.createdAt
    ],

    [
      'amount_usd',
      payload.amount_usd
    ],

    [
      'amount_cdf',
      payload.amount_cdf
    ],

    [
      'client.name',
      payload.client?.name
    ],

    [
      'client.email',
      payload.client?.email
    ],

    [
      'payment.ticket',
      payload.payment?.ticket
    ]

  ];


  const missing =
    required

      .filter(
        ([, value]) =>
          value === undefined ||
          value === null ||
          String(value).trim() === ''
      )

      .map(
        ([key]) =>
          key
      );


  if (
    missing.length > 0
  ) {

    throw new Error(
      `Champs obligatoires manquants : ${missing.join(', ')}`
    );
  }


  const createdAt =
    new Date(
      payload.createdAt
    );


  if (
    Number.isNaN(
      createdAt.getTime()
    )
  ) {

    throw new Error(
      'La date de création de la commande est invalide.'
    );
  }


  const amountUSD =
    Number(
      payload.amount_usd
    );

  const amountCDF =
    Number(
      payload.amount_cdf
    );


  if (
    !Number.isFinite(amountUSD) ||
    amountUSD < 0
  ) {

    throw new Error(
      'Le montant USD est invalide.'
    );
  }


  if (
    !Number.isFinite(amountCDF) ||
    amountCDF < 0
  ) {

    throw new Error(
      'Le montant CDF est invalide.'
    );
  }


  return {

    orderId:
      String(
        payload.orderId
      ).trim(),

    uniqueCode:
      String(
        payload.uniqueCode
      )
        .trim()
        .toUpperCase(),

    createdAt:
      createdAt.toISOString(),

    amount_usd:
      Number(
        amountUSD.toFixed(2)
      ),

    amount_cdf:
      Number(
        amountCDF.toFixed(2)
      ),

    client: {

      name:
        String(
          payload.client.name
        ).trim(),

      phone:
        String(
          payload.client.phone || ''
        ).trim(),

      email:
        String(
          payload.client.email
        ).trim(),

      commune:
        String(
          payload.client.commune || ''
        ).trim(),

      quartier:
        String(
          payload.client.quartier || ''
        ).trim(),

      reference:
        String(
          payload.client.reference || ''
        ).trim()

    },

    items:
      Array.isArray(
        payload.items
      )
        ? payload.items
        : [],

    payment: {

      status:
        'PENDING_VERIFICATION',

      channel:
        String(
          payload.payment.channel || ''
        )
          .trim()
          .toLowerCase() ||
        null,

      ticket:
        String(
          payload.payment.ticket
        )
          .trim()
          .toUpperCase()

    }

  };
}


/* ============================================================
   VÉRIFICATION AUTOMATIQUE DU TICKET
============================================================ */

function verifyTicketBinding(
  order
) {

  const ticket =
    order?.payment?.ticket || '';

  const uniqueCode =
    order?.uniqueCode || '';


  const cleanOrderId =
    String(
      order.orderId || ''
    )
      .replace(
        /[^A-Z0-9]/gi,
        ''
      )
      .toUpperCase();


  /*
   * Même source que le frontend :
   *
   * orderId
   * uniqueCode
   * createdAt
   * amount_usd
   */

  const ticketBindingSource =
    `${order.orderId}|${uniqueCode}|${order.createdAt}|${Number(order.amount_usd).toFixed(2)}`;


  /*
   * Recalcul de la preuve.
   */

  const expectedProof =
    generateOrderFingerprint(
      ticketBindingSource
    );


  const expectedPrefix =
    `TCK-${cleanOrderId}-${expectedProof}-`;


  /*
   * Vérification du format général.
   */

  const validFormat =
    /^TCK-[A-Z0-9]+-[A-Z0-9]{7}-\d{2}$/
      .test(
        ticket
      );


  /*
   * Vérification du rattachement
   * du ticket à cette commande.
   */

  const linkedToOrder =
    ticket.startsWith(
      expectedPrefix
    );


  /*
   * Extraction du numéro de ticket.
   */

  const ticketNumber =
    linkedToOrder
      ? ticket.slice(
          expectedPrefix.length
        )
      : null;


  /*
   * Un ticket valide doit être
   * compris entre 01 et 05.
   */

  const validTicketNumber =
    /^\d{2}$/.test(
      ticketNumber || ''
    ) &&
    Number(ticketNumber) >= 1 &&
    Number(ticketNumber) <= 5;


  /*
   * Le code unique doit également
   * être rattaché à orderId.
   */

  const uniqueCodeLinkedToOrder =
    uniqueCode.startsWith(
      `${order.orderId}-`
    );


  const passed =
    validFormat &&
    uniqueCodeLinkedToOrder &&
    linkedToOrder &&
    validTicketNumber;


  return {

    status:
      passed
        ? 'PASSED'
        : 'FAILED',

    uniqueCodeLinkedToOrder,

    linkedToOrder,

    validFormat,

    validTicketNumber,

    expectedProof,

    expectedPrefix,

    ticketNumber,

    checkedAt:
      nowISO(),

    reason:
      passed

        ? 'Le ticket et le code unique correspondent à cette commande.'

        : 'Le ticket ou le code unique ne permet pas d’établir la correspondance avec cette commande.'

  };
}


/* ============================================================
   CONSTRUCTION DU DOSSIER DE GESTION
============================================================ */

function hydrateOrder(
  payload
) {

  const order =
    normalizeOrderPayload(
      payload
    );


  const automaticVerification =
    verifyTicketBinding(
      order
    );


  return {

    ...order,

    receivedAt:
      nowISO(),

    status:
      automaticVerification.status === 'PASSED'
        ? 'AWAITING_MANAGER'
        : 'AUTO_REJECTED',

    verification: {

      automatic:
        automaticVerification,

      manager: {

        status:
          'PENDING',

        amountReceived:
          null,

        checkedAt:
          null,

        note:
          null

      }

    },

    invoice: {

      status:
        'NOT_GENERATED',

      number:
        null,

      generatedAt:
        null,

      sentAt:
        null

    }

  };
}


/* ============================================================
   RECHERCHE
============================================================ */

function findOrder(
  orders,
  orderId
) {

  return orders.find(
    order =>
      order.orderId === orderId
  );

}

/* ============================================================
   RÉSERVATION D'UN ID DE COMMANDE
============================================================ */

app.post(
  '/api/orders/reserve-id',
  (_req, res) => {

    try {

      const orderId =
        reserveNextOrderId();


      return res.status(
        201
      ).json({

        success:
          true,

        orderId

      });

    } catch (error) {

      console.error(
        'Erreur lors de la réservation de l’identifiant de commande :',
        error
      );


      return res.status(
        500
      ).json({

        success:
          false,

        message:
          'Impossible de réserver un identifiant de commande.'

      });

    }

  }
);

/* ============================================================
   API HEALTH
============================================================ */

app.get(
  '/api/health',
  (_req, res) => {

    res.json({

      success:
        true,

      service:
        'fulltech-management',

      time:
        nowISO()

    });

  }
);


/* ============================================================
   RÉCEPTION D'UNE COMMANDE
============================================================ */

app.post(
  '/api/orders',
  (req, res) => {

    try {

      const orders =
        readOrders();


      const order =
        hydrateOrder(
          req.body
        );

const existingOrder =
  findOrder(
    orders,
    order.orderId
  );


if (
  existingOrder
) {

  /*
   * Même commande renvoyée une deuxième fois :
   * on considère l'opération comme idempotente.
   */

  if (
    existingOrder.uniqueCode ===
    order.uniqueCode
  ) {

    console.warn(
      `[${nowISO()}] COMMANDE DÉJÀ ENREGISTRÉE — renvoi de la commande existante : ${order.orderId}`
    );


    return res.status(
      200
    ).json({

      success:
        true,

      duplicate:
        true,

      message:
        'Cette commande était déjà enregistrée. Le dossier existant est retourné.',

      order:
        existingOrder

    });

  }


  /*
   * Même orderId mais autre commande :
   * véritable conflit.
   */

  console.error(
    `[${nowISO()}] CONFLIT D'IDENTIFIANT : ${order.orderId}`
  );

  console.error(
    `Commande existante : ${existingOrder.uniqueCode}`
  );

  console.error(
    `Commande reçue      : ${order.uniqueCode}`
  );


  return res.status(
    409
  ).json({

    success:
      false,

    duplicate:
      false,

    message:
      'Un autre dossier utilise déjà cet identifiant de commande.',

    orderId:
      order.orderId

  });

}

      orders.push(
        order
      );


      writeOrders(
        orders
      );


      return res.status(
        201
      ).json({

        success:
          true,

        message:
          'Commande reçue et enregistrée.',

        order

      });

    } catch (error) {

      return res.status(
        400
      ).json({

        success:
          false,

        message:
          error.message

      });

    }

  }
);


/* ============================================================
   LISTE + FILTRAGE
============================================================ */

app.get(
  '/api/orders',
  (req, res) => {

    const orders =
      readOrders();


    const status =
      String(
        req.query.status || ''
      ).trim();


    const channel =
      String(
        req.query.channel || ''
      )
        .trim()
        .toLowerCase();


    const q =
      String(
        req.query.q || ''
      )
        .trim()
        .toLowerCase();


    const filtered =
      orders

        .filter(
          order =>
            !status ||
            order.status === status
        )

        .filter(
          order =>
            !channel ||
            order.payment.channel === channel
        )

        .filter(
          order => {

            if (!q) {
              return true;
            }


            const haystack = [

              order.orderId,

              order.uniqueCode,

              order.client?.name,

              order.client?.email,

              order.client?.phone,

              order.payment?.ticket,

              order.status

            ]

              .filter(Boolean)

              .join(' ')

              .toLowerCase();


            return haystack.includes(
              q
            );

          }
        )

        .sort(
          (a, b) =>
            new Date(
              b.receivedAt
            ) -
            new Date(
              a.receivedAt
            )
        );


    return res.json({

      success:
        true,

      total:
        filtered.length,

      orders:
        filtered

    });

  }
);


/* ============================================================
   DÉTAIL D'UNE COMMANDE
============================================================ */

app.get(
  '/api/orders/:orderId',
  (req, res) => {

    const order =
      findOrder(
        readOrders(),
        req.params.orderId
      );


    if (!order) {

      return res.status(
        404
      ).json({

        success:
          false,

        message:
          'Commande introuvable.'

      });
    }


    return res.json({

      success:
        true,

      order

    });

  }
);


/* ============================================================
   VÉRIFICATION AUTOMATIQUE
============================================================ */

app.post(
  '/api/orders/:orderId/auto-verify',
  (req, res) => {

    const orders =
      readOrders();


    const order =
      findOrder(
        orders,
        req.params.orderId
      );


    if (!order) {

      return res.status(
        404
      ).json({

        success:
          false,

        message:
          'Commande introuvable.'

      });

    }


    const automaticVerification =
      verifyTicketBinding(
        order
      );


    order.verification =
      order.verification || {};


    order.verification.automatic =
      automaticVerification;


    order.status =
      automaticVerification.status === 'PASSED'
        ? 'AWAITING_MANAGER'
        : 'AUTO_REJECTED';


    writeOrders(
      orders
    );


    return res.json({

      success:
        true,

      order

    });

  }
);


/* ============================================================
   VÉRIFICATION MANUELLE DU GÉRANT
============================================================ */

app.post(
  '/api/orders/:orderId/manager-verify',
  (req, res) => {

    const orders =
      readOrders();


    const order =
      findOrder(
        orders,
        req.params.orderId
      );


    if (!order) {

      return res.status(
        404
      ).json({

        success:
          false,

        message:
          'Commande introuvable.'

      });

    }


    /*
     * La deuxième étape ne peut commencer
     * que si la première a réussi.
     */

    if (
      order.verification?.automatic?.status !==
      'PASSED'
    ) {

      return res.status(
        409
      ).json({

        success:
          false,

        message:
          'La vérification automatique doit être réussie avant la validation du gérant.'

      });

    }


    const amountReceived =
      Number(
        req.body?.amountReceived
      );


    const note =
      String(
        req.body?.note || ''
      ).trim();


    const confirmedByManager =
      req.body?.confirmedByManager === true;


    if (
      !Number.isFinite(
        amountReceived
      ) ||
      amountReceived < 0
    ) {

      return res.status(
        400
      ).json({

        success:
          false,

        message:
          'Montant reçu invalide.'

      });

    }


    if (
      !confirmedByManager
    ) {

      return res.status(
        400
      ).json({

        success:
          false,

        message:
          'La confirmation du gérant est requise.'

      });

    }


    /*
     * Correspondance exacte du montant.
     */

    const matches =
      Math.abs(
        amountReceived -
        Number(
          order.amount_cdf
        )
      ) < 0.01;


    order.verification.manager = {

      status:
        matches
          ? 'PASSED'
          : 'FAILED',

      amountReceived,

      checkedAt:
        nowISO(),

      note:
        note || null

    };


    if (matches) {

      order.payment.status =
        'VALIDATED';

      order.status =
        'VALIDATED';

    } else {

      order.payment.status =
        'PAYMENT_MISMATCH';

      order.status =
        'PAYMENT_MISMATCH';

    }


    writeOrders(
      orders
    );


    return res.json({

      success:
        true,

      matched:
        matches,

      order

    });

  }
);


/* ============================================================
   REFUS
============================================================ */

app.post(
  '/api/orders/:orderId/reject',
  (req, res) => {

    const orders =
      readOrders();


    const order =
      findOrder(
        orders,
        req.params.orderId
      );


    if (!order) {

      return res.status(
        404
      ).json({

        success:
          false,

        message:
          'Commande introuvable.'

      });

    }


    const reason =
      String(
        req.body?.reason || ''
      ).trim();


    const rawAmount =
      Number(
        req.body?.amountReceived
      );


    order.status =
      'REJECTED';


    order.payment.status =
      'REJECTED';


    order.verification.manager = {

      status:
        'FAILED',

      amountReceived:
        Number.isFinite(
          rawAmount
        )
          ? rawAmount
          : null,

      checkedAt:
        nowISO(),

      note:
        reason ||
        'Commande refusée par le gérant.'

    };


    writeOrders(
      orders
    );


    return res.json({

      success:
        true,

      order

    });

  }
);


/* ============================================================
   GÉNÉRATION FACTURE
============================================================ */

app.post(
  '/api/orders/:orderId/invoice',
  (req, res) => {

    const orders =
      readOrders();


    const order =
      findOrder(
        orders,
        req.params.orderId
      );


    if (!order) {

      return res.status(
        404
      ).json({

        success:
          false,

        message:
          'Commande introuvable.'

      });

    }


    /*
     * Une facture ne peut être générée
     * qu'après validation des deux niveaux.
     */

    if (
      order.status !==
      'VALIDATED'
    ) {

      return res.status(
        409
      ).json({

        success:
          false,

        message:
          'La facture ne peut être générée qu’après validation des deux niveaux.'

      });

    }


    order.invoice = {

      status:
        'GENERATED',

      number:
        order.invoice?.number ||
        generateInvoiceNumber(
          order.orderId
        ),

      generatedAt:
        nowISO(),

      sentAt:
        order.invoice?.sentAt ||
        null

    };


    writeOrders(
      orders
    );


    return res.json({

      success:
        true,

      order

    });

  }
);


/* ============================================================
   FACTURE ENVOYÉE
============================================================ */

app.post(
  '/api/orders/:orderId/invoice/sent',
  (req, res) => {

    const orders =
      readOrders();


    const order =
      findOrder(
        orders,
        req.params.orderId
      );


    if (!order) {

      return res.status(
        404
      ).json({

        success:
          false,

        message:
          'Commande introuvable.'

      });

    }


    if (
      order.invoice?.status !==
        'GENERATED' &&
      order.invoice?.status !==
        'SENT'
    ) {

      return res.status(
        409
      ).json({

        success:
          false,

        message:
          'La facture doit être générée avant son envoi.'

      });

    }


    order.invoice.status =
      'SENT';


    order.invoice.sentAt =
      nowISO();


    writeOrders(
      orders
    );


    return res.json({

      success:
        true,

      order

    });

  }
);


/* ============================================================
   STATISTIQUES
============================================================ */

app.get(
  '/api/stats',
  (_req, res) => {

    const orders =
      readOrders();


    const count =
      status =>
        orders.filter(
          order =>
            order.status === status
        ).length;


    return res.json({

      success:
        true,

      stats: {

        total:
          orders.length,

        received:
          count(
            'RECEIVED'
          ),

        awaitingManager:
          count(
            'AWAITING_MANAGER'
          ),

        validated:
          count(
            'VALIDATED'
          ),

        rejected:
          count(
            'REJECTED'
          ),

        mismatches:
          count(
            'PAYMENT_MISMATCH'
          ),

        autoRejected:
          count(
            'AUTO_REJECTED'
          )

      }

    });

  }
);


/* ============================================================
   GESTION DES ERREURS
============================================================ */

app.use(
  (
    error,
    _req,
    res,
    _next
  ) => {

    console.error(
      error
    );


    res.status(
      500
    ).json({

      success:
        false,

      message:
        error.message ||
        'Erreur interne.'

    });

  }
);


/* ============================================================
   DÉMARRAGE
============================================================ */

app.listen(
  PORT,
  () => {

    console.log(
      `FullTech Management démarré sur http://localhost:${PORT}`
    );

  }
);