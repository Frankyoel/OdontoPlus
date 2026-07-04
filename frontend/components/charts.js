/* ============================================================
   OdontoPlus — Charts Component (charts.js)
   Gráficos simples renderizados con HTML/CSS/SVG para evitar dependencias
   ============================================================ */

const Charts = {
    /** Genera un gráfico de barras simple (para ingresos/citas de 7 días) */
    barChart({ id, data, height = 200, color = 'var(--color-primary)' }) {
        if (!data || data.length === 0) return '';
        
        const maxValue = Math.max(...data.map(d => d.value), 1);
        
        const barsHtml = data.map(d => {
            const percentage = (d.value / maxValue) * 100;
            const barHeight = Math.max(percentage, 5); // min 5% para que se vea
            
            return `
                <div class="chart-col" style="flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: var(--space-xs); group">
                    <div class="tooltip" style="opacity: 0; transition: opacity 0.2s; margin-bottom: 4px; pointer-events: none;">
                        ${d.label}: ${d.format ? d.format(d.value) : d.value}
                    </div>
                    <div class="chart-bar" style="width: 24px; height: ${barHeight}%; background: ${d.active ? color : 'var(--color-primary-fixed-dim)'}; border-radius: 4px 4px 0 0; transition: height 0.5s ease-out; cursor: pointer;" onmouseover="this.previousElementSibling.style.opacity=1" onmouseout="this.previousElementSibling.style.opacity=0"></div>
                    <div class="chart-label text-label-md text-muted" style="font-size: 10px;">${d.shortLabel || d.label}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="chart-container" id="${id}" style="height: ${height}px; display: flex; align-items: flex-end; justify-content: space-between; padding-top: 24px; position: relative;">
                ${barsHtml}
            </div>
        `;
    }
};

window.Charts = Charts;
