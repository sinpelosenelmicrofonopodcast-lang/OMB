import type { Locale } from "@/lib/i18n/locale";

const statusLabelMap = {
  available: { en: "Available", es: "Disponible" },
  pending: { en: "Pending", es: "Pendiente" },
  sold: { en: "Sold", es: "Vendido" }
} as const;

const uiMessageMap: Record<string, { en: string; es: string }> = {
  "Name and email are required": {
    en: "Name and email are required",
    es: "Nombre y correo son obligatorios"
  },
  "Unable to submit inquiry.": {
    en: "Unable to submit inquiry.",
    es: "No se pudo enviar la consulta."
  },
  "Lead deleted": {
    en: "Lead deleted",
    es: "Lead eliminado"
  },
  "Site settings saved": {
    en: "Site settings saved",
    es: "Configuración del sitio guardada"
  },
  "Failed to save site settings.": {
    en: "Failed to save site settings.",
    es: "No se pudo guardar la configuración del sitio."
  },
  "Name and quote required": {
    en: "Name and quote required",
    es: "Nombre y cita son obligatorios"
  },
  "Testimonial created": {
    en: "Testimonial created",
    es: "Testimonio creado"
  },
  "Failed to create testimonial.": {
    en: "Failed to create testimonial.",
    es: "No se pudo crear el testimonio."
  },
  "Testimonial updated": {
    en: "Testimonial updated",
    es: "Testimonio actualizado"
  },
  "Failed to update testimonial.": {
    en: "Failed to update testimonial.",
    es: "No se pudo actualizar el testimonio."
  },
  "Publish status updated": {
    en: "Publish status updated",
    es: "Estado de publicación actualizado"
  },
  "Testimonial deleted": {
    en: "Testimonial deleted",
    es: "Testimonio eliminado"
  },
  "Vehicle title is required.": {
    en: "Vehicle title is required.",
    es: "El título del vehículo es obligatorio."
  },
  "Vehicle created": {
    en: "Vehicle created",
    es: "Vehículo creado"
  },
  "Failed to create vehicle.": {
    en: "Failed to create vehicle.",
    es: "No se pudo crear el vehículo."
  },
  "Missing vehicle id": {
    en: "Missing vehicle id",
    es: "Falta el ID del vehículo"
  },
  "VIN is required.": {
    en: "VIN is required.",
    es: "El VIN es obligatorio."
  },
  "VIN format is invalid. VIN must be 17 characters (no I, O, Q).": {
    en: "VIN format is invalid. VIN must be 17 characters (no I, O, Q).",
    es: "El formato del VIN no es válido. Debe tener 17 caracteres (sin I, O, Q)."
  },
  "VIN verification service unavailable.": {
    en: "VIN verification service unavailable.",
    es: "El servicio de verificación VIN no está disponible."
  },
  "VIN check could not decode this VIN.": {
    en: "VIN check could not decode this VIN.",
    es: "La verificación VIN no pudo decodificar este VIN."
  },
  "VIN verified with NHTSA and saved.": {
    en: "VIN verified with NHTSA and saved.",
    es: "VIN verificado con NHTSA y guardado."
  },
  "Failed to verify VIN.": {
    en: "Failed to verify VIN.",
    es: "No se pudo verificar el VIN."
  },
  "Vehicle not found.": {
    en: "Vehicle not found.",
    es: "Vehículo no encontrado."
  },
  "Vehicle updated": {
    en: "Vehicle updated",
    es: "Vehículo actualizado"
  },
  "Failed to update vehicle.": {
    en: "Failed to update vehicle.",
    es: "No se pudo actualizar el vehículo."
  },
  "Updated featured status": {
    en: "Updated featured status",
    es: "Estado destacado actualizado"
  },
  "Updated publish status": {
    en: "Updated publish status",
    es: "Estado de publicación actualizado"
  },
  "Vehicle marked sold": {
    en: "Vehicle marked sold",
    es: "Vehículo marcado como vendido"
  },
  "Vehicle deleted": {
    en: "Vehicle deleted",
    es: "Vehículo eliminado"
  },
  "Account created. Ask an admin to grant admin role before dashboard access.": {
    en: "Account created. Ask an admin to grant admin role before dashboard access.",
    es: "Cuenta creada. Pide a un admin que te otorgue rol admin antes de entrar al panel."
  },
  "Invalid login credentials": {
    en: "Invalid login credentials",
    es: "Credenciales de acceso inválidas"
  },
  "Email not confirmed": {
    en: "Email not confirmed",
    es: "Correo no confirmado"
  },
  "Team member name is required.": {
    en: "Team member name is required.",
    es: "El nombre del miembro del equipo es obligatorio."
  },
  "Team member created": {
    en: "Team member created",
    es: "Miembro del equipo creado"
  },
  "Failed to create team member.": {
    en: "Failed to create team member.",
    es: "No se pudo crear el miembro del equipo."
  },
  "Missing team member id": {
    en: "Missing team member id",
    es: "Falta el ID del miembro del equipo"
  },
  "Team member updated": {
    en: "Team member updated",
    es: "Miembro del equipo actualizado"
  },
  "Failed to update team member.": {
    en: "Failed to update team member.",
    es: "No se pudo actualizar el miembro del equipo."
  },
  "Team member deleted": {
    en: "Team member deleted",
    es: "Miembro del equipo eliminado"
  },
  "Failed to delete team member.": {
    en: "Failed to delete team member.",
    es: "No se pudo eliminar el miembro del equipo."
  },
  "Team members table missing. Run latest database migration.": {
    en: "Team members table missing. Run latest database migration.",
    es: "Falta la tabla team_members. Ejecuta la migración más reciente de la base de datos."
  }
};

export const messages = {
  en: {
    language: {
      en: "EN",
      es: "ES",
      switchLabel: "Language"
    },
    nav: {
      home: "Home",
      inventory: "Inventory",
      about: "About",
      contact: "Contact",
      admin: "Admin",
      login: "Login"
    },
    common: {
      all: "All",
      yes: "Yes",
      no: "No",
      featured: "Featured",
      mileage: "Mileage",
      year: "Year",
      status: "Status",
      sort: "Sort",
      search: "Search",
      applyFilters: "Apply Filters",
      na: "N/A",
      callForPrice: "Call for Price"
    },
    footer: {
      tagline: "Luxury inventory, transparent service, and elevated buying experience.",
      visit: "Visit",
      connect: "Connect",
      adminLogin: "Admin Login",
      rights: "All rights reserved."
    },
    home: {
      heroEyebrow: "Premium Automotive Experience",
      exploreInventory: "Explore Inventory",
      callPrefix: "Call",
      featuredEyebrow: "Featured",
      featuredTitle: "Featured Vehicles",
      featuredDescription: "A rotating showcase of high-demand luxury inventory available now.",
      noFeatured: "No featured vehicles are published yet.",
      whyEyebrow: "Why OMB",
      whyTitle: "Luxury Standards, Local Trust",
      whyDescription: "Every part of our process is designed for confidence, discretion, and premium value.",
      whyCards: [
        {
          title: "Curated Luxury Inventory",
          description: "Hand-selected sedans, SUVs, and performance vehicles from trusted brands."
        },
        {
          title: "Transparent Purchase Process",
          description: "Clear pricing, complete vehicle disclosures, and straightforward financing support."
        },
        {
          title: "Local, Relationship-Driven Service",
          description: "Personalized attention from first visit to long-term ownership support."
        }
      ],
      aboutEyebrow: "About OMB AUTO SALES",
      aboutTitle: "Driven by quality. Built on trust.",
      aboutDescription:
        "OMB AUTO SALES is a Killeen-based dealership focused on luxury and performance vehicles with transparent, relationship-first service.",
      learnMore: "Learn More",
      locationTitle: "Location & Contact",
      scheduleVisit: "Schedule a Visit",
      testimonialsEyebrow: "Testimonials",
      testimonialsTitle: "Client Experiences",
      noTestimonials: "Testimonials will appear here once published in admin."
    },
    about: {
      eyebrow: "About Us",
      title: "OMB AUTO SALES",
      intro:
        "OMB AUTO SALES delivers a premium dealership experience with a focus on luxury vehicles, transparent guidance, and long-term customer relationships. We serve drivers across Central Texas from our Killeen location.",
      missionTitle: "Our Mission",
      missionDescription:
        "Provide exceptional vehicles and concierge-level service with integrity at every step of the buying process.",
      visitTitle: "Visit Us",
      teamEyebrow: "Our Team",
      teamTitle: "Meet the Team",
      teamDescription: "The professionals behind OMB AUTO SALES are here to deliver a smooth, trusted buying experience.",
      teamEmpty: "Team profiles will appear here once added by admin."
    },
    contact: {
      eyebrow: "Contact",
      title: "Let's Talk Luxury",
      description: "Request pricing, financing options, or a showroom appointment. Our team responds quickly.",
      callNow: "Call Now",
      submitted: "Inquiry received. Our team will contact you shortly.",
      linkedTo: "Inquiry linked to:",
      viewVehicle: "view vehicle",
      name: "Name",
      email: "Email",
      phone: "Phone",
      message: "Message",
      messagePlaceholder: "Tell us what you are looking for...",
      sendInquiry: "Send Inquiry"
    },
    inventory: {
      eyebrow: "Inventory",
      title: "Luxury Inventory",
      description: "Search and filter current inventory by make, year, price range, and availability.",
      make: "Make",
      minPrice: "Min Price",
      maxPrice: "Max Price",
      newest: "Newest",
      priceLowToHigh: "Price: Low to High",
      priceHighToLow: "Price: High to Low",
      searchPlaceholder: "Mercedes, BMW, GLE...",
      foundSuffix: "vehicles found",
      noMatches: "No vehicles matched your filters. Adjust criteria and try again."
    },
    vehicleCard: {
      featured: "FEATURED"
    },
    vehicleDetail: {
      featured: "FEATURED",
      overview: "Overview",
      make: "Make",
      model: "Model",
      trim: "Trim",
      vin: "VIN",
      drivetrain: "Drivetrain",
      transmission: "Transmission",
      fuelType: "Fuel Type",
      color: "Color",
      highlights: "Highlights",
      callNow: "Call Now",
      contactVehicle: "Contact About This Vehicle",
      description: "Description",
      additionalSpecs: "Additional Specs"
    },
    login: {
      eyebrow: "Account Access",
      title: "Admin Authentication",
      signIn: "Sign In",
      createAccount: "Create Account",
      fullName: "Full Name",
      password: "Password",
      signUp: "Sign Up"
    },
    notFound: {
      title: "Page Not Found",
      description: "The page you requested is unavailable or has moved.",
      returnHome: "Return Home"
    },
    admin: {
      sidebar: {
        dashboard: "Dashboard",
        inventory: "Inventory",
        addVehicle: "Add Vehicle",
        siteSettings: "Site Settings",
        leads: "Leads",
        testimonials: "Testimonials",
        team: "Team"
      },
      topbar: {
        title: "Admin Dashboard",
        logout: "Logout"
      },
      stats: {
        totalVehicles: "Total Vehicles",
        available: "Available",
        sold: "Sold",
        leads7d: "Leads (7d)"
      },
      dashboard: {
        recentUpdates: "Recent Inventory Updates",
        manageInventory: "Manage Inventory",
        title: "Title",
        price: "Price",
        status: "Status",
        updated: "Updated",
        noVehicles: "No vehicles yet. Add your first listing."
      },
      inventory: {
        title: "Inventory Manager",
        vehiclesSuffix: "vehicles",
        addVehicle: "Add Vehicle",
        searchPlaceholder: "Search title, make, model",
        filter: "Filter",
        tableTitle: "Title",
        price: "Price",
        status: "Status",
        featured: "Featured",
        published: "Published",
        updated: "Updated",
        actions: "Actions",
        verifyVin: "Verify VIN",
        carfax: "CARFAX",
        downloadPdf: "Download PDF",
        edit: "Edit",
        markSold: "Mark Sold",
        feature: "Feature",
        unfeature: "Unfeature",
        publish: "Publish",
        unpublish: "Unpublish",
        delete: "Delete",
        noVehicles: "No vehicles found."
      },
      vehicleForm: {
        title: "Title",
        slugOptional: "Slug (optional)",
        year: "Year",
        make: "Make",
        model: "Model",
        trim: "Trim",
        mileage: "Mileage",
        priceUsd: "Price (USD)",
        vin: "VIN",
        color: "Color",
        drivetrain: "Drivetrain",
        transmission: "Transmission",
        fuelType: "Fuel Type",
        mainImageUrl: "Main Image URL",
        uploadMainImage: "Upload Main Image",
        uploadGallery: "Upload Gallery Images",
        galleryUrls: "Gallery URLs (one per line)",
        highlights: "Highlights (one per line)",
        description: "Description",
        specsJson: "Specs JSON",
        featured: "Featured",
        published: "Published",
        addVehicle: "Add Vehicle",
        createVehicle: "Create Vehicle",
        editPrefix: "Edit Vehicle:",
        saveChanges: "Save Changes"
      },
      siteSettings: {
        title: "Site Settings",
        businessName: "Business Name",
        phone: "Phone",
        hours: "Hours",
        address: "Address",
        heroHeadline: "Hero Headline",
        heroSubheadline: "Hero Subheadline",
        heroBgUrl: "Hero Background URL",
        save: "Save Settings"
      },
      leads: {
        title: "Leads",
        view: "View",
        vehicle: "Vehicle:",
        generalInquiry: "General inquiry",
        message: "Message:",
        noMessage: "(No message provided)",
        delete: "Delete Lead",
        empty: "No leads submitted yet."
      },
      testimonials: {
        title: "Testimonials",
        add: "Add Testimonial",
        name: "Name",
        rating: "Rating (1-5)",
        quote: "Quote",
        published: "Published",
        create: "Create",
        save: "Save",
        delete: "Delete",
        empty: "No testimonials created."
      },
      team: {
        title: "Team Members",
        add: "Add Team Member",
        name: "Name",
        role: "Role / Position",
        order: "Display Order",
        photoUrl: "Photo URL",
        uploadPhoto: "Upload Photo",
        bio: "Short Bio",
        published: "Published",
        create: "Create",
        save: "Save",
        delete: "Delete",
        noPhoto: "No photo",
        empty: "No team members created."
      }
    }
  },
  es: {
    language: {
      en: "EN",
      es: "ES",
      switchLabel: "Idioma"
    },
    nav: {
      home: "Inicio",
      inventory: "Inventario",
      about: "Nosotros",
      contact: "Contacto",
      admin: "Admin",
      login: "Acceso"
    },
    common: {
      all: "Todos",
      yes: "Sí",
      no: "No",
      featured: "Destacado",
      mileage: "Millaje",
      year: "Año",
      status: "Estado",
      sort: "Ordenar",
      search: "Buscar",
      applyFilters: "Aplicar filtros",
      na: "N/D",
      callForPrice: "Llamar para precio"
    },
    footer: {
      tagline: "Inventario de lujo, servicio transparente y una experiencia de compra superior.",
      visit: "Visítanos",
      connect: "Conecta",
      adminLogin: "Acceso Admin",
      rights: "Todos los derechos reservados."
    },
    home: {
      heroEyebrow: "Experiencia automotriz premium",
      exploreInventory: "Explorar inventario",
      callPrefix: "Llamar",
      featuredEyebrow: "Destacados",
      featuredTitle: "Vehículos destacados",
      featuredDescription: "Una selección rotativa de inventario de lujo disponible ahora.",
      noFeatured: "Aún no hay vehículos destacados publicados.",
      whyEyebrow: "Por qué OMB",
      whyTitle: "Estándares de lujo, confianza local",
      whyDescription: "Cada parte de nuestro proceso está pensada para confianza, discreción y valor premium.",
      whyCards: [
        {
          title: "Inventario de lujo seleccionado",
          description: "Sedanes, SUVs y vehículos de alto rendimiento seleccionados de marcas confiables."
        },
        {
          title: "Proceso de compra transparente",
          description: "Precios claros, divulgación completa y apoyo directo para financiamiento."
        },
        {
          title: "Servicio local y cercano",
          description: "Atención personalizada desde la primera visita hasta el soporte posterior."
        }
      ],
      aboutEyebrow: "Sobre OMB AUTO SALES",
      aboutTitle: "Impulsados por calidad. Construidos con confianza.",
      aboutDescription:
        "OMB AUTO SALES es un dealer en Killeen enfocado en vehículos de lujo y alto rendimiento con servicio transparente y trato cercano.",
      learnMore: "Ver más",
      locationTitle: "Ubicación y contacto",
      scheduleVisit: "Agenda una visita",
      testimonialsEyebrow: "Testimonios",
      testimonialsTitle: "Experiencias de clientes",
      noTestimonials: "Los testimonios aparecerán aquí cuando se publiquen en admin."
    },
    about: {
      eyebrow: "Sobre nosotros",
      title: "OMB AUTO SALES",
      intro:
        "OMB AUTO SALES ofrece una experiencia premium con enfoque en vehículos de lujo, asesoría transparente y relaciones duraderas. Atendemos a conductores de todo Texas Central desde Killeen.",
      missionTitle: "Nuestra misión",
      missionDescription:
        "Ofrecer vehículos excepcionales y un servicio tipo concierge con integridad en cada paso de compra.",
      visitTitle: "Visítanos",
      teamEyebrow: "Nuestro equipo",
      teamTitle: "Conoce al equipo",
      teamDescription:
        "Los profesionales detrás de OMB AUTO SALES están aquí para darte una experiencia de compra confiable y sin complicaciones.",
      teamEmpty: "Los perfiles del equipo aparecerán aquí cuando los agregue el admin."
    },
    contact: {
      eyebrow: "Contacto",
      title: "Hablemos de lujo",
      description: "Solicita precios, opciones de financiamiento o una cita en showroom. Respondemos rápido.",
      callNow: "Llamar ahora",
      submitted: "Consulta recibida. Nuestro equipo te contactará pronto.",
      linkedTo: "Consulta vinculada a:",
      viewVehicle: "ver vehículo",
      name: "Nombre",
      email: "Correo",
      phone: "Teléfono",
      message: "Mensaje",
      messagePlaceholder: "Cuéntanos qué vehículo estás buscando...",
      sendInquiry: "Enviar consulta"
    },
    inventory: {
      eyebrow: "Inventario",
      title: "Inventario de lujo",
      description: "Busca y filtra inventario por marca, año, rango de precio y disponibilidad.",
      make: "Marca",
      minPrice: "Precio mínimo",
      maxPrice: "Precio máximo",
      newest: "Más recientes",
      priceLowToHigh: "Precio: menor a mayor",
      priceHighToLow: "Precio: mayor a menor",
      searchPlaceholder: "Mercedes, BMW, GLE...",
      foundSuffix: "vehículos encontrados",
      noMatches: "No se encontraron vehículos con esos filtros. Ajusta los criterios e intenta otra vez."
    },
    vehicleCard: {
      featured: "DESTACADO"
    },
    vehicleDetail: {
      featured: "DESTACADO",
      overview: "Resumen",
      make: "Marca",
      model: "Modelo",
      trim: "Versión",
      vin: "VIN",
      drivetrain: "Tracción",
      transmission: "Transmisión",
      fuelType: "Combustible",
      color: "Color",
      highlights: "Destacados",
      callNow: "Llamar ahora",
      contactVehicle: "Consultar por este vehículo",
      description: "Descripción",
      additionalSpecs: "Especificaciones adicionales"
    },
    login: {
      eyebrow: "Acceso de cuenta",
      title: "Autenticación admin",
      signIn: "Iniciar sesión",
      createAccount: "Crear cuenta",
      fullName: "Nombre completo",
      password: "Contraseña",
      signUp: "Registrarse"
    },
    notFound: {
      title: "Página no encontrada",
      description: "La página solicitada no está disponible o fue movida.",
      returnHome: "Volver al inicio"
    },
    admin: {
      sidebar: {
        dashboard: "Panel",
        inventory: "Inventario",
        addVehicle: "Agregar vehículo",
        siteSettings: "Configuración del sitio",
        leads: "Leads",
        testimonials: "Testimonios",
        team: "Equipo"
      },
      topbar: {
        title: "Panel de administración",
        logout: "Cerrar sesión"
      },
      stats: {
        totalVehicles: "Vehículos totales",
        available: "Disponibles",
        sold: "Vendidos",
        leads7d: "Leads (7d)"
      },
      dashboard: {
        recentUpdates: "Actualizaciones recientes de inventario",
        manageInventory: "Gestionar inventario",
        title: "Título",
        price: "Precio",
        status: "Estado",
        updated: "Actualizado",
        noVehicles: "Aún no hay vehículos. Agrega tu primer listado."
      },
      inventory: {
        title: "Gestor de inventario",
        vehiclesSuffix: "vehículos",
        addVehicle: "Agregar vehículo",
        searchPlaceholder: "Buscar por título, marca o modelo",
        filter: "Filtrar",
        tableTitle: "Título",
        price: "Precio",
        status: "Estado",
        featured: "Destacado",
        published: "Publicado",
        updated: "Actualizado",
        actions: "Acciones",
        verifyVin: "Verificar VIN",
        carfax: "CARFAX",
        downloadPdf: "Descargar PDF",
        edit: "Editar",
        markSold: "Marcar vendido",
        feature: "Destacar",
        unfeature: "Quitar destacado",
        publish: "Publicar",
        unpublish: "Ocultar",
        delete: "Eliminar",
        noVehicles: "No se encontraron vehículos."
      },
      vehicleForm: {
        title: "Título",
        slugOptional: "Slug (opcional)",
        year: "Año",
        make: "Marca",
        model: "Modelo",
        trim: "Versión",
        mileage: "Millaje",
        priceUsd: "Precio (USD)",
        vin: "VIN",
        color: "Color",
        drivetrain: "Tracción",
        transmission: "Transmisión",
        fuelType: "Combustible",
        mainImageUrl: "URL de imagen principal",
        uploadMainImage: "Subir imagen principal",
        uploadGallery: "Subir imágenes de galería",
        galleryUrls: "URLs de galería (una por línea)",
        highlights: "Destacados (uno por línea)",
        description: "Descripción",
        specsJson: "Specs JSON",
        featured: "Destacado",
        published: "Publicado",
        addVehicle: "Agregar vehículo",
        createVehicle: "Crear vehículo",
        editPrefix: "Editar vehículo:",
        saveChanges: "Guardar cambios"
      },
      siteSettings: {
        title: "Configuración del sitio",
        businessName: "Nombre del negocio",
        phone: "Teléfono",
        hours: "Horario",
        address: "Dirección",
        heroHeadline: "Título principal",
        heroSubheadline: "Subtítulo principal",
        heroBgUrl: "URL de fondo del hero",
        save: "Guardar cambios"
      },
      leads: {
        title: "Leads",
        view: "Ver",
        vehicle: "Vehículo:",
        generalInquiry: "Consulta general",
        message: "Mensaje:",
        noMessage: "(Sin mensaje)",
        delete: "Eliminar lead",
        empty: "Aún no se han enviado leads."
      },
      testimonials: {
        title: "Testimonios",
        add: "Agregar testimonio",
        name: "Nombre",
        rating: "Calificación (1-5)",
        quote: "Cita",
        published: "Publicado",
        create: "Crear",
        save: "Guardar",
        delete: "Eliminar",
        empty: "No hay testimonios creados."
      },
      team: {
        title: "Miembros del equipo",
        add: "Agregar miembro",
        name: "Nombre",
        role: "Rol / Puesto",
        order: "Orden de visualización",
        photoUrl: "URL de foto",
        uploadPhoto: "Subir foto",
        bio: "Bio corta",
        published: "Publicado",
        create: "Crear",
        save: "Guardar",
        delete: "Eliminar",
        noPhoto: "Sin foto",
        empty: "No hay miembros del equipo creados."
      }
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return messages[locale];
}

export function translateStatus(status: string, locale: Locale) {
  const key = status.toLowerCase() as keyof typeof statusLabelMap;
  const entry = statusLabelMap[key];
  if (!entry) return status;
  return entry[locale];
}

export function translateUiMessage(message: string, locale: Locale) {
  const translated = uiMessageMap[message];
  if (!translated) return message;
  return translated[locale];
}
