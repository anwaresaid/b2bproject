import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useConfigStore } from "@/stores/config";
import store from "@/store";
import MainLayout from "@/layouts/main-layout/MainLayout.vue";
import Dashboard from "@/views/Dashboard.vue";
import LayoutBuilder from "@/views/LayoutBuilder.vue";
import Profile from "@/components/page-layouts/Profile.vue";
import Horizontal from "@/views/crafted/pages/wizards/Horizontal.vue";
import Vertical from "@/views/crafted/pages/wizards/Vertical.vue";
import Account from "@/views/crafted/account/Account.vue";
import GettingStarted from "@/views/apps/customers/GettingStarted.vue";
import KinguinMarketPlace from "@/views/apps/marketplace/marketplace-match/KinguinMarketPlace.vue";
import GamivoMarketPlace from "@/views/apps/marketplace/marketplace-match/GamivoMarketPlace.vue";
import EnebaMarketPlace from "@/views/apps/marketplace/marketplace-match/EnebaMarketPlace.vue";
import MarketplaceMatchListing from "@/views/apps/marketplace/MarketplaceMatchListing.vue";
import CustomersListing from "@/views/apps/customers/CustomersListing.vue";
import NotificationsAll from "@/views/apps/notifications/NotificationsAll.vue";
import GeneralAccount from "@/views/apps/accounting/GeneralAccount.vue";
import StockList from "@/views/apps/stock/StockList.vue";
import GameListing from "@/views/apps/games/GameListing.vue";
import RolesListing from "@/views/apps/roles/RolesListing.vue";
import CustomerDetails from "@/views/apps/customers/CustomerDetails.vue";
import SuppliersListing from "@/views/apps/suppliers/SuppliersListing.vue";
import OrdersListing from "@/views/apps/orders/OrdersListing.vue";
import CreateOrder from "@/views/apps/orders/CreateOrder.vue";
import EditOrder from "@/views/apps/orders/EditOrder.vue";
import KeysListing from "@/views/apps/keys/KeysListing.vue";
import OffersListing from "@/views/apps/offers/OffersListing.vue";
import UsersListing from "@/views/apps/users/UsersListing.vue";
import SubscriptionGettingStarted from "@/views/apps/subscriptions/GettingStarted.vue";
import SubscriptionList from "@/views/apps/subscriptions/SubscriptionList.vue";
import AddSubscription from "@/views/apps/subscriptions/AddSubscription.vue";
import ViewSubscription from "@/views/apps/subscriptions/ViewSubscription.vue";
import Calendar from "@/views/apps/Calendar.vue";
import SignUp from "@/views/crafted/authentication/basic-flow/SignUp.vue";
import PasswordReset from "@/views/crafted/authentication/basic-flow/PasswordReset.vue";
import SignIn from "@/views/crafted/authentication/basic-flow/SignIn.vue";
import TwoFactor from "@/views/crafted/authentication/basic-flow/TwoFactor.vue";
import Error404 from "@/views/crafted/authentication/Error404.vue";
import Error500 from "@/views/crafted/authentication/Error500.vue";
import Mixed from "@/views/crafted/widgets/Mixed.vue";
import Charts from "@/views/crafted/widgets/Charts.vue";
import DrawerChat from "@/views/apps/chat/DrawerChat.vue";
import Chat from "@/views/apps/chat/Chat.vue";
import Settings from "@/views/crafted/account/Settings.vue";
import Overview from "@/views/crafted/pages/profile/Overview.vue";
import Projects from "@/views/crafted/pages/profile/Projects.vue";
import Campaigns from "@/views/crafted/pages/profile/Campaigns.vue";
import Documents from "@/views/crafted/pages/profile/Documents.vue";
import Connections from "@/views/crafted/pages/profile/Connections.vue";
import Activity from "@/views/crafted/pages/profile/Activity.vue";
import InviteFriends from "@/views/crafted/modals/general/InviteFriends.vue";
import ViewUsers from "@/views/crafted/modals/general/ViewUsers.vue";
import UpgradePlan from "@/views/crafted/modals/general/UpgradePlan.vue";
import ShareAndEarn from "@/views/crafted/modals/general/ShareAndEarn.vue";
import NewTarget from "@/views/crafted/modals/forms/NewTarget.vue";
import NewCard from "@/views/crafted/modals/forms/NewCard.vue";
import NewAddress from "@/views/crafted/modals/forms/NewAddress.vue";
import CreateApiKey from "@/views/crafted/modals/forms/CreateApiKey.vue";
import TwoFactorAuth from "@/views/crafted/modals/wizards/TwoFactorAuth.vue";
import CreateApp from "@/views/crafted/modals/wizards/CreateApp.vue";
import CreateAccount from "@/views/crafted/modals/wizards/CreateAccount.vue";
import Lists from "@/views/crafted/widgets/Lists.vue";
import Statistics from "@/views/crafted/widgets/Statistics.vue";
import Tables from "@/views/crafted/widgets/Tables.vue";
import Feeds from "@/views/crafted/widgets/Feeds.vue";
import MultiStepSignUp from "@/views/crafted/authentication/MultiStepSignUp.vue";
import SystemLayout from "@/layouts/SystemLayout.vue";
import MoneyBoxList from "@/views/apps/moneybox/MoneyBoxlist.vue";
import ReservationList from "@/views/apps/reservation/ReservationList.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/dashboard",
    component: () => MainLayout,
    meta: {
      middleware: "auth",
    },
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        component: () => Dashboard,
        meta: {
          pageTitle: "Dashboard",
          breadcrumbs: ["Dashboards"],
        },
      },
      {
        path: "/builder",
        name: "builder",
        component: () => LayoutBuilder,
        meta: {
          pageTitle: "Layout Builder",
          breadcrumbs: ["Layout"],
        },
      },
      {
        path: "/crafted/pages/profile",
        name: "profile",
        component: () => Profile,
        meta: {
          breadcrumbs: ["Pages", "Profile"],
        },
        children: [
          {
            path: "overview",
            name: "profile-overview",
            component: () => Overview,
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "projects",
            name: "profile-projects",
            component: () => Projects,
            meta: {
              pageTitle: "Projects",
            },
          },
          {
            path: "campaigns",
            name: "profile-campaigns",
            component: () => Campaigns,
            meta: {
              pageTitle: "Campaigns",
            },
          },
          {
            path: "documents",
            name: "profile-documents",
            component: () => Documents,
            meta: {
              pageTitle: "Documents",
            },
          },
          {
            path: "connections",
            name: "profile-connections",
            component: () => Connections,
            meta: {
              pageTitle: "Connections",
            },
          },
          {
            path: "activity",
            name: "profile-activity",
            component: () => Activity,
            meta: {
              pageTitle: "Activity",
            },
          },
        ],
      },
      {
        path: "/crafted/pages/wizards/horizontal",
        name: "horizontal-wizard",
        component: () => Horizontal,
        meta: {
          pageTitle: "Horizontal",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/pages/wizards/vertical",
        name: "vertical-wizard",
        component: () => Vertical,
        meta: {
          pageTitle: "Vertical",
          breadcrumbs: ["Pages", "Wizard"],
        },
      },
      {
        path: "/crafted/account",
        name: "account",
        component: () => Account,
        meta: {
          breadcrumbs: ["Crafted", "Account"],
        },
        children: [
          {
            path: "overview",
            name: "account-overview",
            component: () => Overview,
            meta: {
              pageTitle: "Overview",
            },
          },
          {
            path: "settings",
            name: "account-settings",
            component: () => Settings,
            meta: {
              pageTitle: "Settings",
            },
          },
        ],
      },
      {
        path: "/apps/customers/getting-started",
        name: "apps-customers-getting-started",
        component: () => GettingStarted,
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/marketplace/kinguin",
        name: "apps-marketplace-kinguin",
        component: () => KinguinMarketPlace,
        meta: {
          pageTitle: "Kinguin Match",
          breadcrumbs: ["Marketplace", "Kinguin Match"],
        },
      },
      {
        path: "/apps/marketplace/gamivo",
        name: "apps-marketplace-gamivo",
        component: () => GamivoMarketPlace,
        meta: {
          pageTitle: "Gamivo Match",
          breadcrumbs: ["Marketplace", "Gamivo Match"],
        },
      },
      {
        path: "/apps/marketplace/Eneba",
        name: "apps-marketplace-eneba",
        component: () => EnebaMarketPlace,
        meta: {
          pageTitle: "Eneba Match",
          breadcrumbs: ["Marketplace", "Eneba Match"],
        },
      },
      {
        path: "/apps/marketplace-match-list",
        name: "apps-marketplace-list",
        component: () => MarketplaceMatchListing,
        meta: {
          pageTitle: "Marketplace-match List",
          breadcrumbs: ["Apps", "Marketplace-match-list"],
        },
      },
      {
        path: "/apps/customers/customers-listing",
        name: "apps-customers-listing",
        component: () => CustomersListing,
        meta: {
          pageTitle: "Customers Listing",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/all-notifications",
        name: "apps-notifications-all",
        component: () => NotificationsAll,
        meta: {
          pageTitle: "Customers Listing",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/account/general-account",
        name: "general-account",
        component: () => GeneralAccount,
        meta: {
          pageTitle: "General Account",
          breadcrumbs: ["Account", "General"],
        },
      },
      {
        path: "/apps/stock-list",
        name: "stock-list",
        component: () => StockList,
        meta: {
          pageTitle: "Stock List",
          breadcrumbs: ["apps", "stock-list"],
        },
      },
      {
        path: "/apps/games",
        name: "apps-games-listing",
        component: () => GameListing,
        meta: {
          pageTitle: "Game Listing",
          breadcrumbs: ["Apps", "Games"],
        },
      },
      {
        path: "/apps/roles",
        name: "apps-roles-listing",
        component: () => RolesListing,
        meta: {
          pageTitle: "Roles Listing",
          breadcrumbs: ["Apps", "Roles"],
        },
      },
      {
        path: "/apps/customers/customer-details",
        name: "apps-customers-details",
        component: () => CustomerDetails,
        meta: {
          pageTitle: "Customers Details",
          breadcrumbs: ["Apps", "Customers"],
        },
      },
      {
        path: "/apps/suppliers",
        name: "suppliers-listing",
        component: () => SuppliersListing,
        meta: {
          pageTitle: "Suppliers",
          breadcrumbs: ["Apps", "Suppliers"],
        },
      },
      {
        path: "/apps/orders",
        name: "orders-listing",
        component: () => OrdersListing,
        meta: {
          pageTitle: "Orders",
          breadcrumbs: ["Apps", "Orders"],
        },
      },
      {
        path: "/apps/create-order",
        name: "orders-create",
        component: () => CreateOrder,
        meta: {
          pageTitle: "Orders",
          breadcrumbs: ["Apps", "Orders"],
        },
      },
      {
        path: "/apps/order-details",
        name: "order-details",
        component: () => EditOrder,
        props: true,
        meta: {
          pageTitle: "Order Details",
          breadcrumbs: ["Apps", "Order Details"],
        },
      },
      {
        path: "/apps/keys",
        name: "keys-listing",
        component: () => KeysListing,
        meta: {
          pageTitle: "Keys",
          breadcrumbs: ["Apps", "Keys"],
        },
      },
      {
        path: "/apps/offers",
        name: "offers-listing",
        component: () => OffersListing,
        meta: {
          pageTitle: "Offers Listing",
          breadcrumbs: ["Apps", "Offers Listing"],
        },
      },
      {
        path: "/apps/users",
        name: "users-listing",
        component: () => UsersListing,
        meta: {
          pageTitle: "Users Listing",
          breadcrumbs: ["Apps", "Users Listing"],
        },
      },
      {
        path: "/apps/subscriptions/getting-started",
        name: "apps-subscriptions-getting-started",
        component: () => SubscriptionGettingStarted,
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/subscription-list",
        name: "apps-subscriptions-subscription-list",
        component: () => SubscriptionList,
        meta: {
          pageTitle: "Getting Started",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/add-subscription",
        name: "apps-subscriptions-add-subscription",
        component: () => AddSubscription,
        meta: {
          pageTitle: "Add Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/subscriptions/view-subscription",
        name: "apps-subscriptions-view-subscription",
        component: () => ViewSubscription,
        meta: {
          pageTitle: "View Subscription",
          breadcrumbs: ["Apps", "Subscriptions"],
        },
      },
      {
        path: "/apps/calendar",
        name: "apps-calendar",
        component: () => Calendar,
        meta: {
          pageTitle: "Calendar",
          breadcrumbs: ["Apps"],
        },
      },
      {
        path: "/apps/chat/private-chat",
        name: "apps-private-chat",
        component: () => Chat,
        meta: {
          pageTitle: "Private Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/group-chat",
        name: "apps-group-chat",
        component: () => Chat,
        meta: {
          pageTitle: "Group Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/apps/chat/drawer-chat",
        name: "apps-drawer-chat",
        component: () => DrawerChat,
        meta: {
          pageTitle: "Drawer Chat",
          breadcrumbs: ["Apps", "Chat"],
        },
      },
      {
        path: "/crafted/modals/general/invite-friends",
        name: "modals-general-invite-friends",
        component: () => InviteFriends,
        meta: {
          pageTitle: "Invite Friends",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/view-user",
        name: "modals-general-view-user",
        component: () => ViewUsers,
        meta: {
          pageTitle: "View User",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/upgrade-plan",
        name: "modals-general-upgrade-plan",
        component: () => UpgradePlan,
        meta: {
          pageTitle: "Upgrade Plan",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/general/share-and-earn",
        name: "modals-general-share-and-earn",
        component: () => ShareAndEarn,
        meta: {
          pageTitle: "Share And Earn",
          breadcrumbs: ["Crafted", "Modals", "General"],
        },
      },
      {
        path: "/crafted/modals/forms/new-target",
        name: "modals-forms-new-target",
        component: () => NewTarget,
        meta: {
          pageTitle: "New Target",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-card",
        name: "modals-forms-new-card",
        component: () => NewCard,
        meta: {
          pageTitle: "New Card",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/new-address",
        name: "modals-forms-new-address",
        component: () => NewAddress,
        meta: {
          pageTitle: "New Address",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/forms/create-api-key",
        name: "modals-forms-create-api-key",
        component: () => CreateApiKey,
        meta: {
          pageTitle: "Create Api Key",
          breadcrumbs: ["Crafted", "Modals", "Forms"],
        },
      },
      {
        path: "/crafted/modals/wizards/two-factor-auth",
        name: "modals-wizards-two-factor-auth",
        component: () => TwoFactorAuth,
        meta: {
          pageTitle: "Two Factory Auth",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-app",
        name: "modals-wizards-create-app",
        component: () => CreateApp,
        meta: {
          pageTitle: "Create App",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/modals/wizards/create-account",
        name: "modals-wizards-create-account",
        component: () => CreateAccount,
        meta: {
          pageTitle: "Create Account",
          breadcrumbs: ["Crafted", "Modals", "Wizards"],
        },
      },
      {
        path: "/crafted/widgets/lists",
        name: "widgets-list",
        component: () => Lists,
        meta: {
          pageTitle: "Lists",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/apps/moneybox",
        name: "apps-money-box",
        component: () => MoneyBoxList,
        meta: {
          pageTitle: "Money Box",
          breadcrumbs: ["Apps", "Moneybox"],
        },
      },
      {
        path: "/apps/reservations",
        name: "apps-reservations-list",
        component: () => ReservationList,
        meta: {
          pageTitle: "Reservation List",
          breadcrumbs: ["Apps", "reservations"],
        },
      },
      {
        path: "/crafted/widgets/statistics",
        name: "widgets-statistics",
        component: () => Statistics,
        meta: {
          pageTitle: "Statistics",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/charts",
        name: "widgets-charts",
        component: () => Charts,
        meta: {
          pageTitle: "Charts",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/mixed",
        name: "widgets-mixed",
        component: () => Mixed,
        meta: {
          pageTitle: "Mixed",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/tables",
        name: "widgets-tables",
        component: () => Tables,
        meta: {
          pageTitle: "Tables",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
      {
        path: "/crafted/widgets/feeds",
        name: "widgets-feeds",
        component: () => Feeds,
        meta: {
          pageTitle: "Feeds",
          breadcrumbs: ["Crafted", "Widgets"],
        },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const configStore = useConfigStore();

  // current page view title
  document.title = `${to.meta.pageTitle} - ${import.meta.env.VITE_APP_NAME}`;
  // reset config to initial state
  configStore.resetLayoutConfig();

  // verify auth token before each page change
  // authStore.verifyAuth();
  // authStore.validation().then((res) => {
  //   // before page access check if page requires authentication
  //   if (to.meta.middleware == "auth") {
  //     if (
  //       authStore.isAuthenticated &&
  //       authStore.isLoggedIn() &&
  //       authStore.isTokenValid.status
  //     ) {
  //       next();
  //     } else {
  //       next({ name: "sign-in" });
  //     }
  //   } else {
  //     next();
  //   }
  store.dispatch("setToken").then((res) => {
    if (to.meta.middleware == "auth") {
      if (
        authStore.isAuthenticated &&
        authStore.isLoggedIn() &&
        store.state.isTokenValid
      ) {
        next();
      } else {
        next({ name: "sign-in" });
      }
    } else {
      next();
    }
  });

  // Scroll page to top on every route change
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

export default router;
