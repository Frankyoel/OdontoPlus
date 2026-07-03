namespace backend.Services
{
    public class GlobalSettingsService
    {
        // Esta clase está diseñada para ser instanciada una sola vez (Patrón Singleton)
        // y compartida en toda la aplicación a través del contenedor de Inyección de Dependencias.
        
        public string ClinicName { get; private set; } = "OdontoPlus";
        public string CurrencySymbol { get; private set; } = "S/";
        public decimal TaxRate { get; private set; } = 0.18m; // IGV 18%

        public void UpdateTaxRate(decimal newRate)
        {
            TaxRate = newRate;
        }

        public void UpdateClinicName(string newName)
        {
            ClinicName = newName;
        }
    }
}
