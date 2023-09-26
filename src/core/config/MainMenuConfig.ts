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
      // {
      //   heading: "layoutBuilder",
      //   route: "/builder",
      //   svgIcon: "/media/icons/duotune/general/gen019.svg",
      //   fontIcon: "bi-layers",
      // },
    ],
  },
  {
    heading: "",
    route: "/modules",
    pages: [
      {
        heading: "Users",
        route: "/users",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      // {
      //   sectionTitle: "pages",
      //   route: "/pages",
      //   svgIcon: "/media/icons/duotune/general/gen022.svg",
      //   fontIcon: "bi-archive",
      //   sub: [
      //     {
      //       sectionTitle: "profile",
      //       route: "/profile",
      //       sub: [
      //         {
      //           heading: "profileOverview",
      //           route: "/crafted/pages/profile/overview",
      //         },
      //         {
      //           heading: "projects",
      //           route: "/crafted/pages/profile/projects",
      //         },
      //         {
      //           heading: "campaigns",
      //           route: "/crafted/pages/profile/campaigns",
      //         },
      //         {
      //           heading: "documents",
      //           route: "/crafted/pages/profile/documents",
      //         },
      //         {
      //           heading: "connections",
      //           route: "/crafted/pages/profile/connections",
      //         },
      //         {
      //           heading: "activity",
      //           route: "/crafted/pages/profile/activity",
      //         },
      //       ],
      //     },
      //     {
      //       sectionTitle: "wizards",
      //       route: "/wizard",
      //       sub: [
      //         {
      //           heading: "horizontal",
      //           route: "/crafted/pages/wizards/horizontal",
      //         },
      //         {
      //           heading: "vertical",
      //           route: "/crafted/pages/wizards/vertical",
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        sectionTitle: "Accounting",
        route: "/account",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
        sub: [
          {
            heading: "General account",
            route: "/account/general-account",
          },
          {
            heading: "Kebir",
            route: "/account/kebir",
          },
        ],
      },

      //     {
      //       sectionTitle: "authentication",
      //       svgIcon: "/media/icons/duotune/technology/teh004.svg",
      //       fontIcon: "bi-sticky",
      //       sub: [
      //         {
      //           sectionTitle: "basicFlow",
      //           sub: [
      //             {
      //               heading: "signIn",
      //               route: "/sign-in",
      //             },
      //             {
      //               heading: "signUp",
      //               route: "/sign-up",
      //             },
      //             {
      //               heading: "passwordReset",
      //               route: "/password-reset",
      //             },
      //           ],
      //         },
      //         {
      //           heading: "multiStepSignUp",
      //           route: "/multi-step-sign-up",
      //         },
      //         {
      //           heading: "error404",
      //           route: "/404",
      //         },
      //         {
      //           heading: "error500",
      //           route: "/500",
      //         },
      //       ],
      //     },
      //     {
      //       sectionTitle: "modals",
      //       route: "/modals",
      //       svgIcon: "/media/icons/duotune/art/art009.svg",
      //       fontIcon: "bi-shield-check",
      //       sub: [
      //         {
      //           sectionTitle: "general",
      //           route: "/general",
      //           sub: [
      //             {
      //               heading: "inviteFriends",
      //               route: "/crafted/modals/general/invite-friends",
      //             },
      //             {
      //               heading: "viewUsers",
      //               route: "/crafted/modals/general/view-user",
      //             },
      //             {
      //               heading: "upgradePlan",
      //               route: "/crafted/modals/general/upgrade-plan",
      //             },
      //             {
      //               heading: "shareAndEarn",
      //               route: "/crafted/modals/general/share-and-earn",
      //             },
      //           ],
      //         },
      //         {
      //           sectionTitle: "forms",
      //           route: "/forms",
      //           sub: [
      //             {
      //               heading: "newTarget",
      //               route: "/crafted/modals/forms/new-target",
      //             },
      //             {
      //               heading: "newCard",
      //               route: "/crafted/modals/forms/new-card",
      //             },
      //             {
      //               heading: "newAddress",
      //               route: "/crafted/modals/forms/new-address",
      //             },
      //             {
      //               heading: "createAPIKey",
      //               route: "/crafted/modals/forms/create-api-key",
      //             },
      //           ],
      //         },
      //         {
      //           sectionTitle: "wizards",
      //           route: "/wizards",
      //           sub: [
      //             {
      //               heading: "twoFactorAuth",
      //               route: "/crafted/modals/wizards/two-factor-auth",
      //             },
      //             {
      //               heading: "createApp",
      //               route: "/crafted/modals/wizards/create-app",
      //             },
      //             {
      //               heading: "createAccount",
      //               route: "/crafted/modals/wizards/create-account",
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //     {
      //       sectionTitle: "widgets",
      //       route: "/widgets",
      //       svgIcon: "/media/icons/duotune/general/gen025.svg",
      //       fontIcon: "bi-layers",
      //       sub: [
      //         {
      //           heading: "widgetsLists",
      //           route: "/crafted/widgets/lists",
      //         },
      //         {
      //           heading: "widgetsStatistics",
      //           route: "/crafted/widgets/statistics",
      //         },
      //         {
      //           heading: "widgetsCharts",
      //           route: "/crafted/widgets/charts",
      //         },
      //         {
      //           heading: "widgetsMixed",
      //           route: "/crafted/widgets/mixed",
      //         },
      //         {
      //           heading: "widgetsTables",
      //           route: "/crafted/widgets/tables",
      //         },
      //         {
      //           heading: "widgetsFeeds",
      //           route: "/crafted/widgets/feeds",
      //         },
      //       ],
      //     },
    ],
  },
  {
    heading: "MODULES",
    route: "/modules",
    pages: [
      {
        sectionTitle: "customers",
        route: "/customers",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
        sub: [
          // {
          //   heading: "gettingStarted",
          //   route: "/customers/getting-started",
          // },
          {
            heading: "customersListing",
            route: "/customers/customers-listing",
          },
          // {
          //   heading: "customerDetails",
          //   route: "/customers/customer-details",
          // },
        ],
      },
      {
        sectionTitle: "Marketplace",
        route: "/marketplace",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
        sub: [
          {
            sectionTitle: "Match",
            route: "/marketplace",
            sub: [
              {
                heading: "Eneba Match",
                route: "/marketplace/eneba",
              },
              {
                heading: "Gamivo Match",
                route: "/marketplace/gamivo",
              },
              {
                heading: "Kinguin Match",
                route: "/marketplace/kinguin",
              },
              {
                heading: "Multiple Match",
                route: "/marketplace/Multiple",
              },
            ],
          },
          {
            heading: "Marketplace match listing",
            route: "/marketplace-match-list",
          },
          {
            heading: "Marketplace settings",
            route: "/marketplace/settings",
          },
        ],
      },
      // {
      //   sectionTitle: "subscriptions",
      //   route: "/subscriptions",
      //   svgIcon: "/media/icons/duotune/ecommerce/ecm002.svg",
      //   fontIcon: "bi-cart",
      //   sub: [
      //     {
      //       heading: "getStarted",
      //       route: "/apps/subscriptions/getting-started",
      //     },
      //     {
      //       heading: "subscriptionList",
      //       route: "/apps/subscriptions/subscription-list",
      //     },
      //     {
      //       heading: "addSubscription",
      //       route: "/apps/subscriptions/add-subscription",
      //     },
      //     {
      //       heading: "viewSubscription",
      //       route: "/apps/subscriptions/view-subscription",
      //     },
      //   ],
      // },
      // {
      //   heading: "calendarApp",
      //   route: "/apps/calendar",
      //   svgIcon: "/media/icons/duotune/general/gen014.svg",
      //   fontIcon: "bi-calendar3-event",
      // },
      // {
      //   sectionTitle: "chat",
      //   route: "/chat",
      //   svgIcon: "/media/icons/duotune/communication/com012.svg",
      //   fontIcon: "bi-chat-left",
      //   sub: [
      //     {
      //       heading: "privateChat",
      //       route: "/apps/chat/private-chat",
      //     },
      //     {
      //       heading: "groupChat",
      //       route: "/apps/chat/group-chat",
      //     },
      //     {
      //       heading: "drawerChat",
      //       route: "/apps/chat/drawer-chat",
      //     },
      //   ],
      // },
      {
        heading: "Games",
        route: "/games",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "Moneybox",
        route: "/moneybox",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "Roles",
        route: "/roles",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "Suppliers",
        route: "/suppliers",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        heading: "Offers",
        route: "/offers",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
      },
      {
        sectionTitle: "Keys",
        route: "/keys",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
        sub: [
          {
            heading: "Keys List",
            route: "/keys",
          },
          {
            heading: "Stock List",
            route: "/stock-list",
          },
          {
            heading: "Follow Key",
            route: "/keys/follow",
          },
        ],
      },
      {
        sectionTitle: "Orders",
        route: "/orders",
        svgIcon: "/media/icons/duotune/art/art002.svg",
        fontIcon: "bi-app-indicator",
        sub: [
          {
            heading: "Orders List",
            route: "/orders",
          },
          {
            heading: "Api Sales",
            route: "/orders-sale",
          },
          {
            heading: "Etail Sales",
            route: "/orders-etail-sales",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
