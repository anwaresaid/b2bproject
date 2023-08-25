export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  svgIcon?: string;
  fontIcon?: string;
  sub?: Array<MenuItem>;
}

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "layoutBuilder",
        route: "/builder",
        svgIcon: "/media/icons/duotune/general/gen019.svg",
        fontIcon: "bi-layers",
      },
    ],
  },
  {
    heading: "craft",
    route: "/crafted",
    pages: [
      {
        heading: "Users",
        route: "/apps/users",
        svgIcon: "/media/icons/duotune/general/genPeople.svg",
        fontIcon: "bi-people-fill",
      },
      {
        sectionTitle: "pages",
        route: "/pages",
        svgIcon: "/media/icons/duotune/general/gen022.svg",
        fontIcon: "bi-archive",
        sub: [
          {
            sectionTitle: "profile",
            route: "/profile",
            sub: [
              {
                heading: "profileOverview",
                route: "/crafted/pages/profile/overview",
              },
              {
                heading: "projects",
                route: "/crafted/pages/profile/projects",
              },
              {
                heading: "campaigns",
                route: "/crafted/pages/profile/campaigns",
              },
              {
                heading: "documents",
                route: "/crafted/pages/profile/documents",
              },
              {
                heading: "connections",
                route: "/crafted/pages/profile/connections",
              },
              {
                heading: "activity",
                route: "/crafted/pages/profile/activity",
              },
            ],
          },
          {
            sectionTitle: "wizards",
            route: "/wizard",
            sub: [
              {
                heading: "horizontal",
                route: "/crafted/pages/wizards/horizontal",
              },
              {
                heading: "vertical",
                route: "/crafted/pages/wizards/vertical",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "Accounting",
        route: "/account",
        svgIcon: "/media/icons/duotune/communication/com006.svg",
        fontIcon: "bi-person",
        sub: [
          {
            heading: "General account",
            route: "/account/general-account",
          },
        ],
      },
      {
        sectionTitle: "authentication",
        svgIcon: "/media/icons/duotune/technology/teh004.svg",
        fontIcon: "bi-sticky",
        sub: [
          {
            sectionTitle: "basicFlow",
            sub: [
              {
                heading: "signIn",
                route: "/sign-in",
              },
              {
                heading: "signUp",
                route: "/sign-up",
              },
              {
                heading: "passwordReset",
                route: "/password-reset",
              },
            ],
          },
          {
            heading: "multiStepSignUp",
            route: "/multi-step-sign-up",
          },
          {
            heading: "error404",
            route: "/404",
          },
          {
            heading: "error500",
            route: "/500",
          },
        ],
      },
      {
        sectionTitle: "modals",
        route: "/modals",
        svgIcon: "/media/icons/duotune/art/art009.svg",
        fontIcon: "bi-shield-check",
        sub: [
          {
            sectionTitle: "general",
            route: "/general",
            sub: [
              {
                heading: "inviteFriends",
                route: "/crafted/modals/general/invite-friends",
              },
              {
                heading: "viewUsers",
                route: "/crafted/modals/general/view-user",
              },
              {
                heading: "upgradePlan",
                route: "/crafted/modals/general/upgrade-plan",
              },
              {
                heading: "shareAndEarn",
                route: "/crafted/modals/general/share-and-earn",
              },
            ],
          },
          {
            sectionTitle: "forms",
            route: "/forms",
            sub: [
              {
                heading: "newTarget",
                route: "/crafted/modals/forms/new-target",
              },
              {
                heading: "newCard",
                route: "/crafted/modals/forms/new-card",
              },
              {
                heading: "newAddress",
                route: "/crafted/modals/forms/new-address",
              },
              {
                heading: "createAPIKey",
                route: "/crafted/modals/forms/create-api-key",
              },
            ],
          },
          {
            sectionTitle: "wizards",
            route: "/wizards",
            sub: [
              {
                heading: "twoFactorAuth",
                route: "/crafted/modals/wizards/two-factor-auth",
              },
              {
                heading: "createApp",
                route: "/crafted/modals/wizards/create-app",
              },
              {
                heading: "createAccount",
                route: "/crafted/modals/wizards/create-account",
              },
            ],
          },
        ],
      },
      {
        sectionTitle: "widgets",
        route: "/widgets",
        svgIcon: "/media/icons/duotune/general/gen025.svg",
        fontIcon: "bi-layers",
        sub: [
          {
            heading: "widgetsLists",
            route: "/crafted/widgets/lists",
          },
          {
            heading: "widgetsStatistics",
            route: "/crafted/widgets/statistics",
          },
          {
            heading: "widgetsCharts",
            route: "/crafted/widgets/charts",
          },
          {
            heading: "widgetsMixed",
            route: "/crafted/widgets/mixed",
          },
          {
            heading: "widgetsTables",
            route: "/crafted/widgets/tables",
          },
          {
            heading: "widgetsFeeds",
            route: "/crafted/widgets/feeds",
          },
        ],
      },
    ],
  },
  {
    heading: "apps",
    route: "/apps",
    pages: [
      {
        sectionTitle: "customers",
        route: "/customers",
        svgIcon: "/media/icons/duotune/finance/fin006.svg",
        fontIcon: "bi-printer",
        sub: [
          {
            heading: "gettingStarted",
            route: "/apps/customers/getting-started",
          },
          {
            heading: "customersListing",
            route: "/apps/customers/customers-listing",
          },
          {
            heading: "customerDetails",
            route: "/apps/customers/customer-details",
          },
        ],
      },
      {
        sectionTitle: "Marketplace",
        route: "/marketplace",
        svgIcon: "/media/icons/duotune/general/gen070-shop.svg",
        fontIcon: "bi-shop",
        sub: [
          {
            sectionTitle: "Match",
            route: "/marketplace",
            sub: [
              {
                heading: "Eneba Match",
                route: "/apps/marketplace/eneba",
              },
              {
                heading: "Gamivo Match",
                route: "/apps/marketplace/gamivo",
              },
              {
                heading: "Kinguin Match",
                route: "/apps/marketplace/kinguin",
              },
            ],
          },
          {
            heading: "Marketplace match listing",
            route: "/apps/marketplace-match-list",
          },
        ],
      },
      {
        sectionTitle: "subscriptions",
        route: "/subscriptions",
        svgIcon: "/media/icons/duotune/ecommerce/ecm002.svg",
        fontIcon: "bi-cart",
        sub: [
          {
            heading: "getStarted",
            route: "/apps/subscriptions/getting-started",
          },
          {
            heading: "subscriptionList",
            route: "/apps/subscriptions/subscription-list",
          },
          {
            heading: "addSubscription",
            route: "/apps/subscriptions/add-subscription",
          },
          {
            heading: "viewSubscription",
            route: "/apps/subscriptions/view-subscription",
          },
        ],
      },
      {
        heading: "calendarApp",
        route: "/apps/calendar",
        svgIcon: "/media/icons/duotune/general/gen014.svg",
        fontIcon: "bi-calendar3-event",
      },
      {
        sectionTitle: "chat",
        route: "/chat",
        svgIcon: "/media/icons/duotune/communication/com012.svg",
        fontIcon: "bi-chat-left",
        sub: [
          {
            heading: "privateChat",
            route: "/apps/chat/private-chat",
          },
          {
            heading: "groupChat",
            route: "/apps/chat/group-chat",
          },
          {
            heading: "drawerChat",
            route: "/apps/chat/drawer-chat",
          },
        ],
      },
      {
        heading: "games",
        route: "/apps/games",
        svgIcon: "/media/icons/duotune/general/gen063.svg",
        fontIcon: "bi-controller",
      },
      {
        heading: "Roles",
        route: "/apps/roles",
        svgIcon: "/media/icons/duotune/general/gen064.svg",
        fontIcon: "bi-person-fill",
      },
      {
        heading: "Suppliers",
        route: "/apps/suppliers",
        svgIcon: "/media/icons/duotune/general/gen065.svg",
        fontIcon: "bi-truck",
      },
      {
        heading: "Offers",
        route: "/apps/offers",
        svgIcon: "/media/icons/duotune/general/gen067.svg",
        fontIcon: "bi-gem",
      },
      {
        heading: "Keys",
        route: "/apps/keys",
        svgIcon: "/media/icons/duotune/general/gen068.svg",
        fontIcon: "bi-gem",
      },
      {
        heading: "Stock List",
        route: "/apps/stock-list",
        svgIcon: "/media/icons/duotune/general/gen-stock.svg",
        fontIcon: "bi-box2-fill",
      },
      {
        heading: "Orders",
        route: "/apps/orders",
        svgIcon: "/media/icons/duotune/general/get069-basket.svg",
        fontIcon: "bi-basket",
      },
    ],
  },
];

export default MainMenuConfig;
