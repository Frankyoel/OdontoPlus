/* ============================================================
   OdontoPlus — Modal Component (modal.js)
   ============================================================ */

const Modal = {
    /** Abre un modal genérico */
    open({ title, content, footer = '', size = 'md', onClose = null }) {
        const sizeMap = { sm: '400px', md: '560px', lg: '720px', xl: '900px' };
        const maxWidth = sizeMap[size] || sizeMap.md;

        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.id = 'modal-backdrop';
        backdrop.innerHTML = `
            <div class="modal" style="max-width: ${maxWidth};" onclick="event.stopPropagation()">
                <div class="modal__header">
                    <h3 class="text-headline-sm">${title}</h3>
                    <button class="btn--icon-sm" onclick="Modal.close()" style="color: var(--color-on-surface-variant); cursor: pointer;">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
                <div class="modal__body">
                    ${content}
                </div>
                ${footer ? `<div class="modal__footer">${footer}</div>` : ''}
            </div>
        `;

        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) Modal.close();
        });

        document.body.appendChild(backdrop);
        this._onClose = onClose;

        // Focus trap
        const firstInput = backdrop.querySelector('input, select, textarea');
        if (firstInput) setTimeout(() => firstInput.focus(), 100);
    },

    /** Cierra el modal actual */
    close() {
        const backdrop = document.getElementById('modal-backdrop');
        if (!backdrop) return;

        backdrop.classList.add('closing');
        setTimeout(() => {
            backdrop.remove();
            if (this._onClose) this._onClose();
        }, 200);
    },

    /** Modal de confirmación */
    confirm({ title = '¿Estás seguro?', message, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'primary', onConfirm }) {
        const btnClass = variant === 'danger' ? 'btn--danger' : 'btn--primary';
        this.open({
            title,
            content: `<p class="text-body-md" style="color: var(--color-on-surface-variant);">${message}</p>`,
            footer: `
                <button class="btn btn--ghost" onclick="Modal.close()">${cancelText}</button>
                <button class="btn ${btnClass}" onclick="(${onConfirm.toString()})(); Modal.close();">${confirmText}</button>
            `,
            size: 'sm'
        });
    },

    /** Modal de formulario con campos genéricos */
    form({ title, fields, submitText = 'Guardar', onSubmit }) {
        const fieldsHtml = fields.map(f => {
            if (f.type === 'select') {
                const options = f.options.map(o =>
                    `<option value="${o.value}" ${o.value === f.value ? 'selected' : ''}>${o.label}</option>`
                ).join('');
                return `
                    <div class="input-group">
                        <label class="input-label">${f.label}</label>
                        <select class="select-field" id="modal-field-${f.name}" name="${f.name}" ${f.required ? 'required' : ''}>
                            ${options}
                        </select>
                    </div>
                `;
            }
            if (f.type === 'textarea') {
                return `
                    <div class="input-group">
                        <label class="input-label">${f.label}</label>
                        <textarea class="input-field" id="modal-field-${f.name}" name="${f.name}" rows="${f.rows || 3}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>${f.value || ''}</textarea>
                    </div>
                `;
            }
            return `
                <div class="input-group">
                    <label class="input-label">${f.label}</label>
                    <input class="input-field" type="${f.type || 'text'}" id="modal-field-${f.name}" name="${f.name}" value="${f.value || ''}" placeholder="${f.placeholder || ''}" ${f.required ? 'required' : ''}>
                </div>
            `;
        }).join('');

        const content = `
            <form id="modal-form" style="display: flex; flex-direction: column; gap: var(--space-md);">
                ${fieldsHtml}
            </form>
        `;

        this.open({
            title,
            content,
            footer: `
                <button class="btn btn--ghost" onclick="Modal.close()">Cancelar</button>
                <button class="btn btn--primary" onclick="Modal.submitForm()">${submitText}</button>
            `,
            size: 'md'
        });

        this._formSubmit = onSubmit;
    },

    /** Envía el formulario del modal */
    submitForm() {
        const form = document.getElementById('modal-form');
        if (!form) return;

        const formData = {};
        const inputs = form.querySelectorAll('input, select, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (input.required && !input.value.trim()) {
                input.style.borderColor = 'var(--color-error)';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
            formData[input.name] = input.value;
        });

        if (!isValid) {
            Toast.show('Por favor completa todos los campos requeridos', 'warning');
            return;
        }

        if (this._formSubmit) {
            this._formSubmit(formData);
        }
        this.close();
    }
};

window.Modal = Modal;
