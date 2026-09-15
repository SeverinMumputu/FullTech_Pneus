/* =========================================================
   FULLTECH CONGO — CANDIDATURE DISTRIBUTEUR
   LOGIQUE STEPPER + EMAILJS
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. CONFIGURATION EMAILJS
       ===================================================== */

    const EMAILJS_PUBLIC_KEY = "8jJYNK-RV0GKhibc0";
    const EMAILJS_SERVICE_ID = "service_w0ror6m";
    const EMAILJS_TEMPLATE_ID = "template_y1pblui";

    /*
     * Initialisation EmailJS
     */
    if (typeof emailjs !== "undefined") {
        emailjs.init({
            publicKey: EMAILJS_PUBLIC_KEY,

            /*
             * Protection basique contre les requêtes automatisées.
             */
            blockHeadless: true,

            /*
             * Limite locale :
             * maximum 1 envoi toutes les 2 secondes.
             */
            limitRate: {
                id: "fulltech-distributor-form",
                throttle: 2000
            }
        });
    }


    /* =====================================================
       2. RÉCUPÉRATION DES ÉLÉMENTS
       ===================================================== */

    const modal = document.getElementById("distributor-modal");
    const openButton = document.getElementById("open-distributor-form");

    const form = document.getElementById("distributor-form");

    const closeButtons = document.querySelectorAll(
        "[data-distributor-close]"
    );

    const nextButton = document.getElementById("distributor-next");
    const previousButton = document.getElementById("distributor-prev");
    const submitButton = document.getElementById("distributor-submit");

    const progressFill = document.getElementById(
        "distributor-progress-fill"
    );

    const statusBox = document.getElementById(
        "distributor-form-status"
    );

    const submittedAt = document.getElementById(
        "distributor-submitted-at"
    );

    const localDetails = document.getElementById(
        "distributor-local-details"
    );

    const localDetailsWrap = document.getElementById(
        "distributor-local-details-wrap"
    );

    const panels = document.querySelectorAll(
        ".ft-distributor-panel"
    );

    const stepIndicators = document.querySelectorAll(
        "[data-step-indicator]"
    );


    /*
     * Si les éléments n'existent pas, on arrête proprement.
     * Cela évite de casser le reste du site.
     */
    if (
        !modal ||
        !openButton ||
        !form ||
        !nextButton ||
        !previousButton ||
        !submitButton
    ) {
        return;
    }


    /* =====================================================
       3. VARIABLES DU STEPPER
       ===================================================== */

    const TOTAL_STEPS = 5;

    let currentStep = 1;

    let isSubmitting = false;


    /* =====================================================
       4. OUVERTURE DU POPUP
       ===================================================== */

    function openModal() {

        modal.classList.add("is-open");

        modal.setAttribute("aria-hidden", "false");

        document.body.classList.add(
            "ft-distributor-modal-open"
        );

        /*
         * Toujours commencer à l'étape 1.
         */
        currentStep = 1;

        updateStepper();

        clearStatus();

        /*
         * Positionnement du scroll du popup.
         */
        const dialog = modal.querySelector(
            ".ft-distributor-dialog"
        );

        if (dialog) {
            dialog.scrollTop = 0;
        }

        /*
         * Focus sur le premier champ.
         */
        setTimeout(() => {

            const firstInput = form.querySelector(
                'input[name="full_name"]'
            );

            if (firstInput) {
                firstInput.focus();
            }

        }, 300);
    }


    /* =====================================================
       5. FERMETURE DU POPUP
       ===================================================== */

    function closeModal() {

        if (isSubmitting) {
            return;
        }

        modal.classList.remove("is-open");

        modal.setAttribute("aria-hidden", "true");

        document.body.classList.remove(
            "ft-distributor-modal-open"
        );
    }


    openButton.addEventListener("click", openModal);


    closeButtons.forEach((button) => {

        button.addEventListener("click", closeModal);

    });


    /*
     * Fermeture avec la touche ESC.
     */
    document.addEventListener("keydown", (event) => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("is-open")
        ) {
            closeModal();
        }

    });


    /* =====================================================
       6. AFFICHAGE DU STEPPER
       ===================================================== */

    function updateStepper() {

        /*
         * Affichage des panneaux.
         */
        panels.forEach((panel) => {

            const step = Number(
                panel.dataset.step
            );

            panel.classList.toggle(
                "is-active",
                step === currentStep
            );

        });


        /*
         * Mise à jour des indicateurs.
         */
        stepIndicators.forEach((indicator) => {

            const step = Number(
                indicator.dataset.stepIndicator
            );

            indicator.classList.toggle(
                "is-active",
                step === currentStep
            );

            indicator.classList.toggle(
                "is-completed",
                step < currentStep
            );

        });


        /*
         * Progression visuelle.
         *
         * Étape 1 = 20 %
         * Étape 2 = 40 %
         * ...
         * Étape 5 = 100 %
         */
        if (progressFill) {

            const progress =
                (currentStep / TOTAL_STEPS) * 100;

            progressFill.style.width =
                `${progress}%`;
        }


        /*
         * Bouton RETOUR.
         */
        previousButton.disabled =
            currentStep === 1;


        /*
         * À la dernière étape :
         * - masquer Continuer
         * - afficher Envoyer
         */
        if (currentStep === TOTAL_STEPS) {

            nextButton.hidden = true;

            submitButton.hidden = false;

        } else {

            nextButton.hidden = false;

            submitButton.hidden = true;
        }


        /*
         * Scroll vers le haut du formulaire.
         */
        const dialog = modal.querySelector(
            ".ft-distributor-dialog"
        );

        if (dialog) {

            dialog.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }
    }


    /* =====================================================
       7. RÉCUPÉRER L'ÉTAPE ACTUELLE
       ===================================================== */

    function getCurrentPanel() {

        return form.querySelector(
            `.ft-distributor-panel[data-step="${currentStep}"]`
        );

    }


    /* =====================================================
       8. AFFICHER UNE ERREUR
       ===================================================== */

    function showFieldError(field, message) {

        const container =
            field.closest(
                ".ft-distributor-field"
            );

        if (container) {

            container.classList.add(
                "has-error"
            );

            const error =
                container.querySelector(
                    ".ft-distributor-error"
                );

            if (error) {
                error.textContent = message;
            }
        }
    }


    /* =====================================================
       9. SUPPRIMER UNE ERREUR
       ===================================================== */

    function clearFieldError(field) {

        const container =
            field.closest(
                ".ft-distributor-field"
            );

        if (container) {

            container.classList.remove(
                "has-error"
            );

            const error =
                container.querySelector(
                    ".ft-distributor-error"
                );

            if (error) {
                error.textContent = "";
            }
        }
    }


    /* =====================================================
       10. ERREUR POUR RADIO / FIELDSET
       ===================================================== */

    function showGroupError(
        fieldset,
        message
    ) {

        fieldset.classList.add(
            "has-error"
        );

        const error =
            fieldset.querySelector(
                ".ft-distributor-error"
            );

        if (error) {
            error.textContent = message;
        }
    }


    function clearGroupError(fieldset) {

        fieldset.classList.remove(
            "has-error"
        );

        const error =
            fieldset.querySelector(
                ".ft-distributor-error"
            );

        if (error) {
            error.textContent = "";
        }
    }


    /* =====================================================
       11. NETTOYAGE DES ERREURS D'UNE ÉTAPE
       ===================================================== */

    function clearPanelErrors(panel) {

        if (!panel) {
            return;
        }

        panel
            .querySelectorAll(
                ".has-error"
            )
            .forEach((element) => {

                element.classList.remove(
                    "has-error"
                );

            });

        panel
            .querySelectorAll(
                ".ft-distributor-error"
            )
            .forEach((error) => {

                error.textContent = "";

            });
    }


    /* =====================================================
       12. VALIDATION D'UNE ÉTAPE
       ===================================================== */

    function validateCurrentStep() {

        const panel = getCurrentPanel();

        if (!panel) {
            return false;
        }

        clearPanelErrors(panel);

        let isValid = true;

        /*
         * -----------------------------------------------
         * CHAMPS INPUT / SELECT / TEXTAREA
         * -----------------------------------------------
         */

        const fields =
            panel.querySelectorAll(
                "input[required]:not([type='radio']), select[required], textarea[required]"
            );


        fields.forEach((field) => {

            /*
             * Champ désactivé :
             * il n'est pas obligatoire.
             */
            if (field.disabled) {
                return;
            }


            const value =
                field.value.trim();


            /*
             * Champ vide.
             */
            if (!value) {

                showFieldError(
                    field,
                    "Ce champ est obligatoire."
                );

                isValid = false;

                return;
            }


            /*
             * Validation native supplémentaire.
             */
            if (
                field.minLength &&
                value.length < field.minLength
            ) {

                showFieldError(
                    field,
                    `Minimum ${field.minLength} caractères.`
                );

                isValid = false;

                return;
            }


            /*
             * Nombre minimum.
             */
            if (
                field.type === "number" &&
                field.min !== "" &&
                Number(value) < Number(field.min)
            ) {

                showFieldError(
                    field,
                    `La valeur minimale est ${field.min}.`
                );

                isValid = false;

                return;
            }


            clearFieldError(field);

        });


        /*
         * -----------------------------------------------
         * RADIO BUTTONS
         * -----------------------------------------------
         */

        const radioGroups = new Set();

        panel
            .querySelectorAll(
                "input[type='radio'][required]"
            )
            .forEach((radio) => {

                radioGroups.add(
                    radio.name
                );

            });


        radioGroups.forEach((groupName) => {

            const radios =
                panel.querySelectorAll(
                    `input[type="radio"][name="${groupName}"]`
                );

            const checked =
                panel.querySelector(
                    `input[type="radio"][name="${groupName}"]:checked`
                );

            if (!checked) {

                const fieldset =
                    radios[0]?.closest(
                        "fieldset"
                    );

                if (fieldset) {

                    showGroupError(
                        fieldset,
                        "Veuillez sélectionner une réponse."
                    );

                }

                isValid = false;

            } else {

                const fieldset =
                    radios[0]?.closest(
                        "fieldset"
                    );

                if (fieldset) {
                    clearGroupError(fieldset);
                }
            }
        });


        /*
         * -----------------------------------------------
         * FOCUS AUTOMATIQUE SUR LA PREMIÈRE ERREUR
         * -----------------------------------------------
         */

        if (!isValid) {

            const firstError =
                panel.querySelector(
                    ".has-error input:not([type='radio']), .has-error select, .has-error textarea"
                );

            if (firstError) {

                setTimeout(() => {
                    firstError.focus();
                }, 50);

            } else {

                const firstRadioError =
                    panel.querySelector(
                        ".has-error input[type='radio']"
                    );

                if (firstRadioError) {

                    firstRadioError.focus();

                }
            }
        }

        return isValid;
    }


    /* =====================================================
       13. BOUTON CONTINUER
       ===================================================== */

    nextButton.addEventListener(
        "click",
        () => {

            /*
             * Impossible d'avancer si l'étape
             * actuelle n'est pas valide.
             */
            if (!validateCurrentStep()) {
                return;
            }


            if (currentStep < TOTAL_STEPS) {

                currentStep++;

                updateStepper();

            }

        }
    );


    /* =====================================================
       14. BOUTON RETOUR
       ===================================================== */

    previousButton.addEventListener(
        "click",
        () => {

            if (currentStep > 1) {

                currentStep--;

                updateStepper();

            }

        }
    );


    /* =====================================================
       15. GESTION DU LOCAL
       ===================================================== */

    function updateLocalField() {

        const selected =
            form.querySelector(
                'input[name="has_local"]:checked'
            );

        if (!selected) {
            return;
        }


        if (selected.value === "Oui") {

            /*
             * Le candidat possède un local.
             */
            localDetails.disabled = false;

            localDetails.required = true;

            if (localDetailsWrap) {

                localDetailsWrap.style.display =
                    "";
            }

        } else {

            /*
             * Le candidat ne possède pas de local.
             */
            localDetails.disabled = true;

            localDetails.required = false;

            localDetails.value = "";

            clearFieldError(localDetails);

            if (localDetailsWrap) {

                localDetailsWrap.style.display =
                    "";
            }
        }
    }


    form
        .querySelectorAll(
            'input[name="has_local"]'
        )
        .forEach((radio) => {

            radio.addEventListener(
                "change",
                updateLocalField
            );

        });


    /* =====================================================
       16. EFFACER LES ERREURS PENDANT LA SAISIE
       ===================================================== */

    form.addEventListener(
        "input",
        (event) => {

            const target = event.target;

            if (
                target.matches(
                    "input, textarea, select"
                )
            ) {

                clearFieldError(target);
            }
        }
    );


    form.addEventListener(
        "change",
        (event) => {

            const target = event.target;

            if (
                target.matches(
                    "input[type='radio']"
                )
            ) {

                const fieldset =
                    target.closest(
                        "fieldset"
                    );

                if (fieldset) {
                    clearGroupError(
                        fieldset
                    );
                }
            }
        }
    );


    /* =====================================================
       17. MESSAGE DE STATUT
       ===================================================== */

    function showStatus(
        message,
        type
    ) {

        if (!statusBox) {
            return;
        }

        statusBox.textContent =
            message;

        statusBox.className =
            "ft-distributor-status is-visible";

        if (type === "success") {

            statusBox.classList.add(
                "is-success"
            );

        } else if (type === "error") {

            statusBox.classList.add(
                "is-error"
            );
        }
    }


    function clearStatus() {

        if (!statusBox) {
            return;
        }

        statusBox.textContent = "";

        statusBox.className =
            "ft-distributor-status";
    }


    /* =====================================================
       18. ÉTAT "ENVOI EN COURS"
       ===================================================== */

    function setLoadingState(loading) {

        isSubmitting = loading;

        const label =
            submitButton.querySelector(
                ".ft-distributor-submit-label"
            );

        const loadingLabel =
            submitButton.querySelector(
                ".ft-distributor-submit-loading"
            );


        submitButton.disabled =
            loading;

        nextButton.disabled =
            loading;

        previousButton.disabled =
            loading;


        if (loading) {

            submitButton.classList.add(
                "is-loading"
            );

            if (label) {
                label.hidden = true;
            }

            if (loadingLabel) {
                loadingLabel.hidden = false;
            }

        } else {

            submitButton.classList.remove(
                "is-loading"
            );

            if (label) {
                label.hidden = false;
            }

            if (loadingLabel) {
                loadingLabel.hidden = true;
            }
        }
    }


    /* =====================================================
       19. ENVOI EMAILJS
       ===================================================== */

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /*
             * Sécurité :
             * on vérifie une dernière fois l'étape 5.
             */
            if (!validateCurrentStep()) {
                return;
            }


            /*
             * Vérification EmailJS.
             */
            if (
                typeof emailjs === "undefined"
            ) {

                showStatus(
                    "Le service EmailJS n'est pas chargé. Vérifiez le script EmailJS dans votre HTML.",
                    "error"
                );

                return;
            }


            /*
             * Empêche l'envoi avec des valeurs
             * de configuration fictives.
             */
            if (
                EMAILJS_PUBLIC_KEY ===
                    "VOTRE_PUBLIC_KEY" ||
                EMAILJS_SERVICE_ID ===
                    "VOTRE_SERVICE_ID" ||
                EMAILJS_TEMPLATE_ID ===
                    "VOTRE_TEMPLATE_ID"
            ) {

                showStatus(
                    "EmailJS n'est pas encore configuré.",
                    "error"
                );

                return;
            }


            /*
             * Empêcher plusieurs clics.
             */
            if (isSubmitting) {
                return;
            }


            /*
             * Date / heure d'envoi.
             */
            if (submittedAt) {

                submittedAt.value =
                    new Date().toLocaleString(
                        "fr-FR",
                        {
                            dateStyle: "full",
                            timeStyle: "medium"
                        }
                    );
            }


            setLoadingState(true);

            clearStatus();


            try {

                /*
                 * Envoi du formulaire complet à EmailJS.
                 *
                 * Les attributs "name" du HTML deviennent
                 * les variables disponibles dans le template.
                 */
                await emailjs.sendForm(
                    EMAILJS_SERVICE_ID,
                    EMAILJS_TEMPLATE_ID,
                    form
                );


                /*
                 * SUCCÈS
                 */
                showStatus(
                    "Votre candidature a bien été envoyée. FullTech Congo vous contactera après étude de votre profil.",
                    "success"
                );


                /*
                 * Réinitialisation du formulaire.
                 */
                form.reset();


                /*
                 * Réinitialisation du champ local.
                 */
                if (localDetails) {

                    localDetails.disabled =
                        true;

                    localDetails.required =
                        false;

                    localDetails.value =
                        "";
                }


                /*
                 * Retour à l'étape 1.
                 */
                currentStep = 1;

                updateStepper();


                /*
                 * On laisse le message de succès
                 * visible quelques secondes.
                 */
                setTimeout(() => {

                    if (
                        modal.classList.contains(
                            "is-open"
                        )
                    ) {
                        closeModal();
                    }

                }, 3500);


            } catch (error) {

                console.error(
                    "Erreur EmailJS :",
                    error
                );


                /*
                 * Message utilisateur simple.
                 * Les détails techniques restent dans
                 * la console du navigateur.
                 */
                showStatus(
                    "Impossible d'envoyer votre candidature pour le moment. Vérifiez votre connexion puis réessayez.",
                    "error"
                );

            } finally {

                setLoadingState(false);

            }

        }
    );


    /* =====================================================
       20. INITIALISATION
       ===================================================== */

    updateLocalField();

    updateStepper();

});