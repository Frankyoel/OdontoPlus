/* ============================================================
   OdontoPlus — Table Component (table.js)
   Tablas dinámicas con renderizado de datos
   ============================================================ */

const Table = {
    /** Genera HTML para una tabla genérica */
    render({ id, columns, data, emptyMessage = 'No hay datos disponibles' }) {
        if (!data || data.length === 0) {
            return `
                <div class="empty-state">
                    <span class="material-symbols-outlined">inbox</span>
                    <p>${emptyMessage}</p>
                </div>
            `;
        }

        const colsHtml = columns.map(col => `<th>${col.label}</th>`).join('');
        
        const rowsHtml = data.map(item => {
            const cellsHtml = columns.map(col => {
                const value = col.render ? col.render(item[col.field], item) : (item[col.field] || '');
                return `<td>${value}</td>`;
            }).join('');
            
            return `<tr>${cellsHtml}</tr>`;
        }).join('');

        return `
            <div class="table-responsive" style="overflow-x: auto;">
                <table class="data-table" id="${id}">
                    <thead>
                        <tr>${colsHtml}</tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        `;
    },

    /** Renderiza badges de estado comunes */
    renderStatus(estado) {
        const maps = {
            'pagado': { color: 'success', label: 'Pagado' },
            'pendiente': { color: 'warning', label: 'Pendiente' },
            'vencido': { color: 'error', label: 'Vencido' },
            'programada': { color: 'primary', label: 'Programada' },
            'confirmada': { color: 'success', label: 'Confirmada' },
            'en_curso': { color: 'warning', label: 'En Curso' },
            'completada': { color: 'tertiary', label: 'Completada' },
            'cancelada': { color: 'error', label: 'Cancelada' },
            'no_asistio': { color: 'error', label: 'No Asistió' },
            'critico': { color: 'error', label: 'Crítico' },
            'bajo': { color: 'warning', label: 'Bajo' },
            'adecuado': { color: 'success', label: 'Adecuado' }
        };
        
        const config = maps[estado] || { color: 'outline', label: estado };
        return `<span class="chip chip--${config.color}">${config.label}</span>`;
    }
};

window.TableComponent = Table;
