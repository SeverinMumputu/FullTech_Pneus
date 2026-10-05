/* ============================================================
   FULLTECH MANAGEMENT — FRONTEND
============================================================ */

const API_BASE =
  'http://localhost:3000';

/* ============================================================
   GMAIL
============================================================ */

/*
 * Index du compte Gmail utilisé par la plateforme.
 *
 * 0 = premier compte Google connecté dans le navigateur.
 *
 * Le compte Gmail de l'entreprise doit être connecté
 * sur cet emplacement pour que le champ "De" utilise
 * l'adresse professionnelle correspondante.
 */
const GMAIL_ACCOUNT_INDEX =
  0;


/*
 * URL de composition Gmail.
 */
const GMAIL_COMPOSE_BASE =
  `https://mail.google.com/mail/u/${GMAIL_ACCOUNT_INDEX}/?view=cm&fs=1`;

/* ============================================================
   ÉTAT
============================================================ */

let allOrders = [];

let selectedOrder = null;


/* ============================================================
   HELPERS
============================================================ */

const $ =
  id =>
    document.getElementById(
      id
    );


const escapeHTML =
  value =>

    String(
      value ?? ''
    )

      .replace(
        /&/g,
        '&amp;'
      )

      .replace(
        /</g,
        '&lt;'
      )

      .replace(
        />/g,
        '&gt;'
      )

      .replace(
        /"/g,
        '&quot;'
      )

      .replace(
        /'/g,
        '&#039;'
      );


const formatUSD =
  value =>
    `$${Number(
      value || 0
    ).toFixed(2)}`;


const formatCDF =
  value =>
    `${Number(
      value || 0
    ).toLocaleString(
      'fr-FR'
    )} CDF`;


const formatDate =
  value =>
    new Date(
      value
    ).toLocaleString(
      'fr-FR',
      {
        dateStyle:
          'medium',

        timeStyle:
          'short'
      }
    );


/* ============================================================
   STATUTS
============================================================ */

const statusLabel =
  status => ({

    RECEIVED:
      'REÇUE',

    AWAITING_MANAGER:
      'À VÉRIFIER',

    VALIDATED:
      'VALIDÉE',

    REJECTED:
      'REFUSÉE',

    PAYMENT_MISMATCH:
      'ÉCART PAIEMENT',

    AUTO_REJECTED:
      'AUTO-REFUS'

  }[
    status
  ] || status);


const statusClass =
  status => ({

    AWAITING_MANAGER:
      'text-yellow-400',

    VALIDATED:
      'text-emerald-400',

    REJECTED:
      'text-red-400',

    PAYMENT_MISMATCH:
      'text-orange-400',

    AUTO_REJECTED:
      'text-red-300'

  }[
    status
  ] || 'text-white/50');


/* ============================================================
   EMPREINTE TICKET
============================================================ */

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
      input.charCodeAt(
        i
      );


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

    .toString(
      36
    )

    .toUpperCase()

    .padStart(
      7,
      '0'
    )

    .slice(
      -7
    );

}


function calculateExpectedTicketProof(
  order
) {

  return generateOrderFingerprint(

    `${order.orderId}|${order.uniqueCode}|${order.createdAt}|${Number(order.amount_usd).toFixed(2)}`

  );

}


/* ============================================================
   API
============================================================ */

async function api(
  path,
  options = {}
) {

  const response =
    await fetch(
      `${API_BASE}${path}`,
      {

        headers: {

          'Content-Type':
            'application/json',

          ...(options.headers || {})

        },

        ...options

      }
    );


  let data =
    null;


  try {

    data =
      await response.json();

  } catch {

    data =
      null;

  }


  if (
    !response.ok
  ) {

    throw new Error(
      data?.message ||
      `Erreur HTTP ${response.status}`
    );

  }


  return data;

}


/* ============================================================
   ÉTAT API
============================================================ */

async function checkApi() {

  try {

    await api(
      '/api/health'
    );


    $('api-state').textContent =
      'API : connectée';


    $('api-state').className =
      'text-xs text-emerald-400';


  } catch (
    error
  ) {

    $('api-state').textContent =
      'API : indisponible';


    $('api-state').className =
      'text-xs text-red-400';


    console.error(
      error
    );

  }

}


/* ============================================================
   STATISTIQUES
============================================================ */

async function loadStats() {

  try {

    const {
      stats
    } =
      await api(
        '/api/stats'
      );


    $('stat-total').textContent =
      stats.total;


    $('stat-awaiting').textContent =
      stats.awaitingManager;


    $('stat-validated').textContent =
      stats.validated;


    $('stat-rejected').textContent =
      stats.rejected;


    $('stat-mismatch').textContent =
      stats.mismatches;


    $('stat-auto-rejected').textContent =
      stats.autoRejected;


  } catch (
    error
  ) {

    console.error(
      error
    );

  }

}


/* ============================================================
   COMMANDES
============================================================ */

async function loadOrders() {

  const params =
    new URLSearchParams();


  const q =
    $('search-input')
      .value
      .trim();


  const status =
    $('status-filter')
      .value;


  const channel =
    $('channel-filter')
      .value;


  if (q) {

    params.set(
      'q',
      q
    );

  }


  if (status) {

    params.set(
      'status',
      status
    );

  }


  if (channel) {

    params.set(
      'channel',
      channel
    );

  }


  try {

    const data =
      await api(
        `/api/orders?${params.toString()}`
      );


    allOrders =
      data.orders || [];


    renderOrders();


  } catch (
    error
  ) {

    $('orders-body').innerHTML = `

      <tr>

        <td
          colspan="6"
          class="px-4 py-12 text-center text-red-300"
        >
          ${escapeHTML(
            error.message
          )}
        </td>

      </tr>

    `;

  }

}


/* ============================================================
   RENDU COMMANDES
============================================================ */

function renderOrders() {

  $('result-count').textContent =

    `${allOrders.length} résultat${
      allOrders.length > 1
        ? 's'
        : ''
    }`;


  if (
    allOrders.length === 0
  ) {

    $('orders-body').innerHTML = `

      <tr>

        <td
          colspan="6"
          class="px-4 py-14 text-center text-white/40"
        >
          Aucune commande ne correspond aux filtres.
        </td>

      </tr>

    `;

    return;

  }


  $('orders-body').innerHTML =

    allOrders.map(
      order => `

      <tr
        class="border-t border-ft-gray/80 hover:bg-white/[.02] transition"
      >

        <td class="px-4 py-4">

          <div
            class="font-mono text-ft-red"
          >
            ${escapeHTML(
              order.orderId
            )}
          </div>

          <div
            class="text-[10px] text-white/35 mt-1"
          >
            ${escapeHTML(
              formatDate(
                order.receivedAt
              )
            )}
          </div>

        </td>


        <td class="px-4 py-4">

          <div>
            ${escapeHTML(
              order.client?.name
            )}
          </div>

          <div
            class="text-xs text-white/40 mt-1"
          >
            ${escapeHTML(
              order.client?.email
            )}
          </div>

        </td>


        <td
          class="px-4 py-4 font-mono"
        >

          <div>
            ${escapeHTML(
              formatUSD(
                order.amount_usd
              )
            )}
          </div>

          <div
            class="text-xs text-white/40 mt-1"
          >
            ${escapeHTML(
              formatCDF(
                order.amount_cdf
              )
            )}
          </div>

        </td>


        <td
          class="px-4 py-4 font-mono text-xs break-all max-w-[300px]"
        >
          ${escapeHTML(
            order.payment?.ticket
          )}
        </td>


        <td class="px-4 py-4">

          <span
            class="text-[10px] tracking-widest ${statusClass(
              order.status
            )}"
          >
            ${escapeHTML(
              statusLabel(
                order.status
              )
            )}
          </span>

        </td>


        <td class="px-4 py-4 text-right">

          <button
            data-order-id="${escapeHTML(
              order.orderId
            )}"
            class="open-order px-4 py-2 border border-ft-gray hover:border-white text-xs"
          >
            Ouvrir
          </button>

        </td>

      </tr>

    `
    ).join('');


  document
    .querySelectorAll(
      '.open-order'
    )
    .forEach(
      button => {

        button.addEventListener(
          'click',
          () =>
            openOrder(
              button.dataset.orderId
            )
        );

      }
    );

}


/* ============================================================
   OUVERTURE DOSSIER
============================================================ */

async function openOrder(
  orderId
) {

  try {

    const data =
      await api(
        `/api/orders/${encodeURIComponent(
          orderId
        )}`
      );


    selectedOrder =
      data.order;


    renderOrderDrawer();


    $('drawer').classList.remove(
      'hidden'
    );


  } catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* ============================================================
   RENDU DOSSIER
============================================================ */

function renderOrderDrawer() {

  if (
    !selectedOrder
  ) {

    return;

  }


  const order =
    selectedOrder;


  const proof =
    calculateExpectedTicketProof(
      order
    );


  const automatic =
    order.verification?.automatic;


  $('drawer-order-id').textContent =
    order.orderId;


  $('detail-client').textContent =
    order.client?.name ||
    '—';


  $('detail-email').textContent =
    order.client?.email ||
    '—';


  $('detail-date').textContent =
    formatDate(
      order.createdAt
    );


  $('detail-amount').textContent =
    `${formatUSD(
      order.amount_usd
    )} · ${formatCDF(
      order.amount_cdf
    )}`;


  $('detail-code').textContent =
    order.uniqueCode;


  $('detail-ticket').textContent =
    order.payment?.ticket ||
    '—';


  $('detail-proof').textContent =
    proof;


  $('detail-ticket-link').textContent =

    automatic?.linkedToOrder

      ? 'Correspondance trouvée'

      : 'Aucune correspondance';


  $('detail-ticket-link').className =

    automatic?.linkedToOrder

      ? 'mt-1 text-emerald-400'

      : 'mt-1 text-red-400';


  $('auto-badge').textContent =

    automatic?.status ===
    'PASSED'

      ? 'RÉUSSI'

      : 'ÉCHEC';


  $('auto-badge').className =

    `px-3 py-1 text-[10px] tracking-widest border ${
      automatic?.status === 'PASSED'
        ? 'border-emerald-500/40 text-emerald-400'
        : 'border-red-500/40 text-red-400'
    }`;


  $('auto-reason').textContent =

    automatic?.reason ||
    'Aucune vérification disponible.';


  $('manager-expected').textContent =
    formatCDF(
      order.amount_cdf
    );


  $('manager-amount').value =
    order.verification?.manager?.amountReceived ??
    '';


  $('manager-note').value =
    order.verification?.manager?.note ||
    '';


  $('manager-confirm').checked =
    false;


  $('manager-validate-btn').disabled =
    order.status ===
    'VALIDATED';


  $('manager-validate-btn').classList.toggle(
    'opacity-50',
    order.status === 'VALIDATED'
  );


  $('invoice-section')
    .classList.toggle(
      'hidden',
      order.status !== 'VALIDATED'
    );


  if (
    order.invoice?.number
  ) {

    $('invoice-number').textContent =
      order.invoice.number;

  } else {

    $('invoice-number').textContent =
      '';

  }


  $('email-box')
    .classList.add(
      'hidden'
    );


  $('invoice-email').value =
    order.client?.email ||
    '';


  $('email-result').textContent =
    '';


  $('manager-result').textContent =

    order.verification?.manager?.status ===
    'PASSED'

      ? 'Deuxième vérification validée.'

      : '';


  if (
    order.status ===
    'VALIDATED'
  ) {

    drawInvoiceCanvas(
      order
    );

  }

}


/* ============================================================
   VÉRIFICATION AUTOMATIQUE
============================================================ */

async function autoVerify() {

  if (
    !selectedOrder
  ) {

    return;

  }


  try {

    const data =
      await api(
        `/api/orders/${encodeURIComponent(
          selectedOrder.orderId
        )}/auto-verify`,
        {
          method:
            'POST'
        }
      );


    selectedOrder =
      data.order;


    renderOrderDrawer();


    await loadOrders();

    await loadStats();


  } catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* ============================================================
   VALIDATION GÉRANT
============================================================ */

async function managerValidate() {

  if (
    !selectedOrder
  ) {

    return;

  }


  const managerAmountInput =
    $('manager-amount');

  const managerConfirmInput =
    $('manager-confirm');

  const managerResult =
    $('manager-result');

  const validateButton =
    $('manager-validate-btn');


  /*
   * Vérification locale du montant.
   */

  const rawAmount =
    managerAmountInput
      ? managerAmountInput.value.trim()
      : '';


  if (
    !rawAmount
  ) {

    managerResult.textContent =
      'Veuillez saisir le montant réellement reçu.';

    managerResult.className =
      'mt-3 text-xs text-red-300';

    if (managerAmountInput) {
      managerAmountInput.focus();
    }

    return;

  }


  const amountReceived =
    Number(
      rawAmount
    );


  if (
    !Number.isFinite(
      amountReceived
    ) ||
    amountReceived < 0
  ) {

    managerResult.textContent =
      'Le montant reçu est invalide.';

    managerResult.className =
      'mt-3 text-xs text-red-300';

    if (managerAmountInput) {
      managerAmountInput.focus();
    }

    return;

  }


  /*
   * La confirmation explicite du gérant
   * est obligatoire avant l'appel backend.
   */

  const confirmed =
    managerConfirmInput
      ? managerConfirmInput.checked
      : false;


  if (
    !confirmed
  ) {

    managerResult.textContent =
      'Veuillez confirmer que vous avez vérifié la transaction avec votre téléphone.';

    managerResult.className =
      'mt-3 text-xs text-red-300';

    if (managerConfirmInput) {
      managerConfirmInput.focus();
    }

    return;

  }


  const note =
    $('manager-note')
      .value
      .trim();


  /*
   * Empêche les clics multiples pendant
   * le traitement de la requête.
   */

  if (validateButton) {

    validateButton.disabled =
      true;

    validateButton.classList.add(
      'opacity-50',
      'cursor-not-allowed'
    );

  }


  managerResult.textContent =
    'Vérification de la transaction…';

  managerResult.className =
    'mt-3 text-xs text-white/50';


  try {

    const data =
      await api(
        `/api/orders/${encodeURIComponent(
          selectedOrder.orderId
        )}/manager-verify`,
        {

          method:
            'POST',

          body:
            JSON.stringify({

              amountReceived,

              note,

              confirmedByManager:
                true

            })

        }
      );


selectedOrder =
  data.order;


if (
  data.matched
) {

  managerResult.textContent =
    'Transaction validée. Génération automatique de la facture…';

  managerResult.className =
    'mt-3 text-xs text-emerald-400';

/* ============================================================
   TÉLÉCHARGEMENT AUTOMATIQUE DE LA FACTURE PNG
============================================================ */

function sanitizeInvoiceFileName(
  value
) {

  return String(
    value || 'CLIENT'
  )
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-zA-Z0-9]+/g,
      '_'
    )
    .replace(
      /^_+|_+$/g,
      ''
    )
    .toUpperCase() ||
    'CLIENT';

}


function getInvoiceFileName(
  order
) {

  const clientName =
    sanitizeInvoiceFileName(
      order?.client?.name
    );


  const invoiceNumber =
    order?.invoice?.number ||
    `FAC-${String(
      order?.orderId || ''
    ).replace(
      /^CMD-/,
      ''
    )}`;


  return (
    `FULLTECH-CONGO-${invoiceNumber}@${clientName}.png`
  );

}


function downloadInvoicePNG(
  order,
  invoiceImage
) {

  if (
    !order ||
    !invoiceImage
  ) {

    return;

  }


  const fileName =
    getInvoiceFileName(
      order
    );


  const downloadLink =
    document.createElement(
      'a'
    );


  downloadLink.href =
    invoiceImage;


  downloadLink.download =
    fileName;


  downloadLink.style.display =
    'none';


  document.body.appendChild(
    downloadLink
  );


  downloadLink.click();


  document.body.removeChild(
    downloadLink
  );


  console.log(
    `[FULLTECH MANAGEMENT] Facture téléchargée : ${fileName}`
  );


  return fileName;

}

  /*
   * ============================================================
   * ÉTAPE II — GÉNÉRATION AUTOMATIQUE DE LA FACTURE
   * ============================================================
   */

  const invoiceOrder =
    await ensureInvoice(
      selectedOrder
    );


  /*
   * ============================================================
   * ÉTAPE II + III — GÉNÉRATION PNG
   * ============================================================
   */

  const invoiceImage =
    drawInvoiceCanvas(
      invoiceOrder
    );


  /*
   * Téléchargement automatique.
   */

  const invoiceFileName =
    downloadInvoicePNG(
      invoiceOrder,
      invoiceImage
    );


  selectedOrder =
    invoiceOrder;


  renderOrderDrawer();


  managerResult.textContent =
    `Transaction validée. Facture générée et téléchargée : ${invoiceFileName}`;

  managerResult.className =
    'mt-3 text-xs text-emerald-400';


} else {

  managerResult.textContent =
    'Écart détecté : le montant reçu ne correspond pas au montant attendu.';

  managerResult.className =
    'mt-3 text-xs text-orange-400';

}


await loadOrders();

await loadStats();


  } catch (
    error
  ) {

    console.error(
      '[FULLTECH MANAGEMENT] Erreur validation gérant :',
      error
    );


    managerResult.textContent =
      error.message ||
      'Erreur lors de la validation de la transaction.';

    managerResult.className =
      'mt-3 text-xs text-red-300';


  } finally {

    /*
     * Si la commande n'est pas encore validée,
     * le bouton redevient disponible.
     */

    if (
      validateButton &&
      selectedOrder?.status !==
        'VALIDATED'
    ) {

      validateButton.disabled =
        false;

      validateButton.classList.remove(
        'opacity-50',
        'cursor-not-allowed'
      );

    }

  }

}


/* ============================================================
   REFUS GÉRANT
============================================================ */

async function managerReject() {

  if (
    !selectedOrder
  ) {

    return;

  }


  const reason =
    prompt(
      'Motif du refus :'
    );


  if (
    reason === null
  ) {

    return;

  }


  try {

    const data =
      await api(
        `/api/orders/${encodeURIComponent(
          selectedOrder.orderId
        )}/reject`,
        {

          method:
            'POST',

          body:
            JSON.stringify({

              reason,

              amountReceived:
                Number(
                  $('manager-amount')
                    .value
                )

            })

        }
      );


    selectedOrder =
      data.order;


    renderOrderDrawer();


    await loadOrders();

    await loadStats();


  } catch (
    error
  ) {

    alert(
      error.message
    );

  }

}


/* ============================================================
   FACTURE CANVAS
============================================================ */

function drawInvoiceCanvas(
  order
) {

  const canvas =
    $('invoice-canvas');


  const ctx =
    canvas.getContext(
      '2d'
    );


  const width =
    canvas.width;


  const height =
    canvas.height;


  /*
   * Fond
   */

  ctx.fillStyle =
    '#ffffff';


  ctx.fillRect(
    0,
    0,
    width,
    height
  );


  /*
   * En-tête
   */

  ctx.fillStyle =
    '#070707';


  ctx.font =
    '700 34px Arial';


  ctx.fillText(
    'FULLTECH CONGO',
    70,
    90
  );


  ctx.fillStyle =
    '#e60000';


  ctx.font =
    '700 22px Arial';


  ctx.fillText(
    'FACTURE',
    70,
    130
  );


  ctx.fillStyle =
    '#202020';


  ctx.font =
    '18px Arial';


  ctx.fillText(
    `N° ${
      order.invoice?.number ||
      ''
    }`,
    850,
    90
  );


  ctx.fillText(
    `Commande ${
      order.orderId
    }`,
    850,
    120
  );


  ctx.strokeStyle =
    '#d8d8d8';


  ctx.beginPath();


  ctx.moveTo(
    70,
    165
  );


  ctx.lineTo(
    width - 70,
    165
  );


  ctx.stroke();


  /*
   * Client
   */

  ctx.fillStyle =
    '#333333';


  ctx.font =
    '700 18px Arial';


  ctx.fillText(
    'CLIENT',
    70,
    220
  );


  ctx.font =
    '17px Arial';


  ctx.fillText(
    order.client?.name ||
      '',
    70,
    252
  );


  ctx.fillText(
    order.client?.phone ||
      '',
    70,
    280
  );


  ctx.fillText(
    order.client?.email ||
      '',
    70,
    308
  );


  ctx.fillText(
    `${order.client?.commune || ''} · ${
      order.client?.quartier || ''
    }`,
    70,
    336
  );


  ctx.fillText(
    order.client?.reference ||
      '',
    70,
    364
  );


  /*
   * Transaction
   */

  ctx.fillStyle =
    '#333333';


  ctx.font =
    '700 18px Arial';


  ctx.fillText(
    'TRANSACTION',
    70,
    430
  );


  ctx.font =
    '16px Arial';


  ctx.fillText(
    `Date : ${
      formatDate(
        order.createdAt
      )
    }`,
    70,
    462
  );


  ctx.fillText(
    `Canal : ${
      (
        order.payment?.channel ||
        ''
      ).toUpperCase()
    }`,
    70,
    490
  );


  ctx.fillText(
    `Ticket : ${
      order.payment?.ticket ||
      ''
    }`,
    70,
    518
  );


  ctx.fillText(
    `Code unique : ${
      order.uniqueCode
    }`,
    70,
    546
  );


  /*
   * Tableau articles
   */

  let y =
    620;


  ctx.fillStyle =
    '#070707';


  ctx.fillRect(
    70,
    y,
    width - 140,
    44
  );


  ctx.fillStyle =
    '#ffffff';


  ctx.font =
    '700 16px Arial';


  ctx.fillText(
    'ARTICLE',
    90,
    y + 28
  );


  ctx.fillText(
    'QTÉ',
    760,
    y + 28
  );


  ctx.fillText(
    'PRIX',
    900,
    y + 28
  );


  ctx.fillText(
    'TOTAL',
    1030,
    y + 28
  );


  y +=
    70;


  ctx.fillStyle =
    '#222222';


  ctx.font =
    '15px Arial';


  (
    order.items || []
  ).forEach(
    item => {

      const name =
        String(
          item.name ||
          item.product_id ||
          'Article'
        );


      const quantity =
        Number(
          item.quantity ||
          0
        );


      const unit =
        Number(
          item.unit_price_usd ||
          0
        );


      const total =
        Number(
          item.line_total_usd ||
          0
        );


      ctx.fillText(
        name.slice(
          0,
          62
        ),
        90,
        y
      );


      ctx.fillText(
        String(
          quantity
        ),
        765,
        y
      );


      ctx.fillText(
        formatUSD(
          unit
        ),
        900,
        y
      );


      ctx.fillText(
        formatUSD(
          total
        ),
        1030,
        y
      );


      y +=
        36;


      ctx.strokeStyle =
        '#ececec';


      ctx.beginPath();


      ctx.moveTo(
        70,
        y - 16
      );


      ctx.lineTo(
        width - 70,
        y - 16
      );


      ctx.stroke();

    }
  );


  /*
   * Total
   */

  y +=
    30;


  ctx.fillStyle =
    '#070707';


  ctx.font =
    '700 22px Arial';


  ctx.fillText(
    'TOTAL PAYÉ',
    760,
    y
  );


  ctx.fillStyle =
    '#e60000';


  ctx.font =
    '700 25px Arial';


  ctx.fillText(
    formatUSD(
      order.amount_usd
    ),
    1030,
    y
  );


  ctx.fillStyle =
    '#444444';


  ctx.font =
    '18px Arial';


  ctx.fillText(
    formatCDF(
      order.amount_cdf
    ),
    1030,
    y + 34
  );


  /*
   * Validation finale
   */

  ctx.fillStyle =
    '#ffffff';


  ctx.strokeStyle =
    '#e60000';


  ctx.lineWidth =
    2;


  ctx.strokeRect(
    70,
    height - 205,
    width - 140,
    110
  );


  ctx.fillStyle =
    '#070707';


  ctx.font =
    '700 18px Arial';


  ctx.fillText(
    'PAIEMENT VALIDÉ',
    95,
    height - 160
  );


  ctx.font =
    '14px Arial';


  ctx.fillText(
    `Commande : ${
      order.orderId
    }`,
    95,
    height - 130
  );


  ctx.fillText(
    `Facture : ${
      order.invoice?.number ||
      ''
    }`,
    95,
    height - 105
  );


  return canvas.toDataURL(
    'image/png'
  );

}

/* ============================================================
   TÉLÉCHARGEMENT AUTOMATIQUE DE LA FACTURE PNG
============================================================ */

function sanitizeInvoiceFileName(
  value
) {

  return String(
    value || 'CLIENT'
  )
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .replace(
      /[^a-zA-Z0-9]+/g,
      '_'
    )
    .replace(
      /^_+|_+$/g,
      ''
    )
    .toUpperCase() ||
    'CLIENT';

}


function downloadInvoicePNG(
  order,
  invoiceImage
) {

  if (
    !order ||
    !invoiceImage
  ) {

    return;

  }


  const clientName =
    sanitizeInvoiceFileName(
      order.client?.name
    );


  const invoiceNumber =
    order.invoice?.number ||
    `FAC-${String(
      order.orderId || ''
    ).replace(
      /^CMD-/,
      ''
    )}`;


  const fileName =
    `FULLTECH-CONGO-${invoiceNumber}@${clientName}.png`;


  const downloadLink =
    document.createElement(
      'a'
    );


  downloadLink.href =
    invoiceImage;


  downloadLink.download =
    fileName;


  downloadLink.style.display =
    'none';


  document.body.appendChild(
    downloadLink
  );


  downloadLink.click();


  document.body.removeChild(
    downloadLink
  );


  console.log(
    `[FULLTECH MANAGEMENT] Facture téléchargée : ${fileName}`
  );


  return fileName;

}

/* ============================================================
   GÉNÉRATION FACTURE
============================================================ */

async function ensureInvoice(
  order
) {

  const data =
    await api(
      `/api/orders/${encodeURIComponent(
        order.orderId
      )}/invoice`,
      {

        method:
          'POST'

      }
    );


  selectedOrder =
    data.order;


  renderOrderDrawer();


  return data.order;

}


async function generateInvoice() {

  if (
    !selectedOrder ||
    selectedOrder.status !==
      'VALIDATED'
  ) {

    return;

  }


  try {

    const order =
      await ensureInvoice(
        selectedOrder
      );


    drawInvoiceCanvas(
      order
    );


  } catch (
    error
  ) {

    alert(
      error.message
    );

  }

}

/* ============================================================
   GMAIL — PRÉPARATION DE L'ENVOI
============================================================ */

async function prepareGmailInvoice() {

  if (
    !selectedOrder
  ) {

    return;

  }


  const email =
    $('invoice-email')
      .value
      .trim();


  if (
    !email
  ) {

    $('email-result').textContent =
      'Email client absent.';

    $('email-result').className =
      'mt-3 text-xs text-red-300';

    return;

  }


  try {

    /*
     * ----------------------------------------------------------
     * 1. S'assurer que la facture existe
     * ----------------------------------------------------------
     */

    if (
      selectedOrder.invoice?.status !==
        'GENERATED' &&

      selectedOrder.invoice?.status !==
        'SENT'
    ) {

      selectedOrder =
        await ensureInvoice(
          selectedOrder
        );

    }


    /*
     * ----------------------------------------------------------
     * 2. Redessiner la facture dans le canvas
     * ----------------------------------------------------------
     */

    const invoiceImage =
      drawInvoiceCanvas(
        selectedOrder
      );


    /*
     * ----------------------------------------------------------
     * 3. Nom du fichier PNG
     * ----------------------------------------------------------
     */

    const invoiceFileName =
      getInvoiceFileName(
        selectedOrder
      );


    /*
     * ----------------------------------------------------------
     * 4. Informations Gmail
     * ----------------------------------------------------------
     */

    const clientName =
      selectedOrder.client?.name ||
      'Client';


    const orderId =
      selectedOrder.orderId ||
      '';


    const invoiceNumber =
      selectedOrder.invoice?.number ||
      '';


    const subject =
      `Votre facture FullTech Congo — ${orderId}`;


    const body =
      `Bonjour ${clientName},\n\n` +

      `Veuillez trouver ci-joint votre facture FullTech Congo.\n\n` +

      `Commande : ${orderId}\n` +

      `Facture : ${invoiceNumber}\n` +

      `Montant : ${formatUSD(
        selectedOrder.amount_usd
      )} · ${formatCDF(
        selectedOrder.amount_cdf
      )}\n\n` +

      `Merci pour votre confiance.\n\n` +

      `FullTech Congo`;


    /*
     * ----------------------------------------------------------
     * 5. Vérification que le PNG existe côté navigateur
     *
     * Le téléchargement permet au gestionnaire de joindre
     * manuellement la facture dans Gmail.
     * ----------------------------------------------------------
     */

    downloadInvoicePNG(
      selectedOrder,
      invoiceImage
    );


    /*
     * ----------------------------------------------------------
     * 6. Construction de l'URL Gmail
     * ----------------------------------------------------------
     */

    const gmailParams =
      new URLSearchParams({

        view:
          'cm',

        fs:
          '1',

        to:
          email,

        su:
          subject,

        body:
          body

      });


    const gmailUrl =
      `${GMAIL_COMPOSE_BASE}&${gmailParams.toString()}`;


    /*
     * ----------------------------------------------------------
     * 7. OUVERTURE GMAIL
     *
     * AUCUN POST.
     * AUCUN service externe.
     * AUCUN envoi automatique.
     *
     * Navigation directe pour éviter le blocage
     * des fenêtres popup après un await.
     * ----------------------------------------------------------
     */

    console.log(
      '[FULLTECH MANAGEMENT] TRANSFERT GMAIL'
    );

    console.log(
      'Destinataire :',
      email
    );

    console.log(
      'Objet :',
      subject
    );

    console.log(
      'Fichier :',
      invoiceFileName
    );

    console.log(
      'URL Gmail :',
      gmailUrl
    );


    window.location.assign(
      gmailUrl
    );


  } catch (
    error
  ) {

    console.error(
      '[FULLTECH MANAGEMENT] Préparation Gmail impossible :',
      error
    );


    $('email-result').textContent =
      error.message ||
      'Impossible de préparer Gmail.';


    $('email-result').className =
      'mt-3 text-xs text-red-300';

  }

}


/* ============================================================
   FERMETURE DRAWER
============================================================ */

function closeDrawer() {

  $('drawer').classList.add(
    'hidden'
  );


  selectedOrder =
    null;

}


/* ============================================================
   ÉVÉNEMENTS
============================================================ */

$('search-input')
  .addEventListener(
    'input',
    () =>
      loadOrders()
  );


$('status-filter')
  .addEventListener(
    'change',
    () =>
      loadOrders()
  );


$('channel-filter')
  .addEventListener(
    'change',
    () =>
      loadOrders()
  );


$('refresh-btn')
  .addEventListener(
    'click',
    async () => {

      await loadOrders();

      await loadStats();

    }
  );


$('close-drawer')
  .addEventListener(
    'click',
    closeDrawer
  );


$('drawer-backdrop')
  .addEventListener(
    'click',
    closeDrawer
  );


$('auto-verify-btn')
  .addEventListener(
    'click',
    autoVerify
  );


$('manager-validate-btn')
  .addEventListener(
    'click',
    managerValidate
  );


$('manager-reject-btn')
  .addEventListener(
    'click',
    managerReject
  );


$('generate-invoice-btn')
  .addEventListener(
    'click',
    generateInvoice
  );


$('show-email-btn')
  .addEventListener(
    'click',
    () => {

      $('email-box')
        .classList
        .remove(
          'hidden'
        );


      $('invoice-email').value =
        selectedOrder?.client?.email ||
        '';

    }
  );


$('skip-email-btn')
  .addEventListener(
    'click',
    () =>
      $('email-box')
        .classList
        .add(
          'hidden'
        )
  );


$('send-email-btn')
  .addEventListener(
    'click',
    prepareGmailInvoice
  );


/* ============================================================
   INITIALISATION
============================================================ */

(async function boot() {

  await checkApi();

  await Promise.all([

    loadStats(),

    loadOrders()

  ]);

})();

/* ============================================================
   ACTUALISATION AUTOMATIQUE DES COMMANDES
============================================================ */

setInterval(
  async () => {

    try {

      await loadOrders();

      await loadStats();

    } catch (error) {

      console.error(
        '[FULLTECH MANAGEMENT] Actualisation automatique impossible :',
        error
      );

    }

  },
  5000
);