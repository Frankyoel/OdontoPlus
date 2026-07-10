namespace backend.Strategies
{
    /// <summary>
    /// Clase estática que centraliza todas las constantes de permisos del sistema.
    /// Es la única fuente de verdad: agregar un nuevo permiso implica solo añadir una constante aquí.
    /// </summary>
    public static class SystemPermissions
    {
        public static class Patients
        {
            public const string View   = "Patients.View";
            public const string Create = "Patients.Create";
            public const string Edit   = "Patients.Edit";
            public const string Delete = "Patients.Delete";
        }

        public static class Appointments
        {
            public const string View   = "Appointments.View";
            public const string Create = "Appointments.Create";
            public const string Edit   = "Appointments.Edit";
            public const string Cancel = "Appointments.Cancel";
        }

        public static class ClinicalHistory
        {
            public const string View   = "ClinicalHistory.View";
            public const string Create = "ClinicalHistory.Create";
            public const string Edit   = "ClinicalHistory.Edit";
        }

        public static class Odontogram
        {
            public const string View = "Odontogram.View";
            public const string Edit = "Odontogram.Edit";
        }

        public static class Treatments
        {
            public const string View   = "Treatments.View";
            public const string Create = "Treatments.Create";
            public const string Edit   = "Treatments.Edit";
        }

        public static class Prescriptions
        {
            public const string View   = "Prescriptions.View";
            public const string Create = "Prescriptions.Create";
            public const string Edit   = "Prescriptions.Edit";
        }

        public static class Inventory
        {
            public const string View        = "Inventory.View";
            public const string Create      = "Inventory.Create";
            public const string Edit        = "Inventory.Edit";
            public const string Delete      = "Inventory.Delete";
            public const string StockIn     = "Inventory.StockIn";
            public const string StockOut    = "Inventory.StockOut";
            public const string StockAdjust = "Inventory.StockAdjust";
        }

        public static class Purchases
        {
            public const string View   = "Purchases.View";
            public const string Create = "Purchases.Create";
            public const string Edit   = "Purchases.Edit";
            public const string Delete = "Purchases.Delete";
        }

        public static class Billing
        {
            public const string View   = "Billing.View";
            public const string Create = "Billing.Create";
            public const string Edit   = "Billing.Edit";
            public const string Cancel = "Billing.Cancel";
        }

        public static class Reports
        {
            public const string View = "Reports.View";
        }

        public static class Users
        {
            public const string View   = "Users.View";
            public const string Create = "Users.Create";
            public const string Edit   = "Users.Edit";
            public const string Delete = "Users.Delete";
        }

        public static class Settings
        {
            public const string Manage = "Settings.Manage";
        }
    }
}
