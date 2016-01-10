app.config(['$translateProvider', function ($translateProvider) {
    $translateProvider.translations('en', {
        'TITLE': 'Hello',
        'LIST_ALL_PLAYERS': 'List all online players',
        'FRENCH': 'French',
        'ENGLISH': 'English',
        'SET_TIME': 'Change server hour',
        'SEND_MESSAGE': 'Send a message',
        'SAVE_WORLD': 'Save world',
        'GIVE_ITEM': 'Give an item to a player',
        'KILL_WILD': 'Kill all wild dinos',
        'BAN_PLAYER': 'Ban a player',
        'LOADING': 'Loading',
        'CLEAR_RESULT': 'Clear results',
        'CHANGE_BACKGROUND_RANDOM': 'Change background randomly',
        'LOGOUT': 'Logout',
        'LOGIN': 'Login',
        'NAME': 'Name',
        'LOOKING_FOR_ITEM': 'Search for item...',
        'LOOKING_FOR_PLAYER': 'Search for player...',
        'RELOAD_LIST_PLAYER': 'Reload players list',
        'RELOAD_LIST_ITEM': 'Reload items list'
    });

    $translateProvider.translations('fr', {
        'TITLE': 'Hallo',
        'LIST_ALL_PLAYERS': 'Lister les joueurs en ligne',
        'FRENCH': 'Français',
        'ENGLISH': 'Anglais',
        'SET_TIME': 'Changer l\'heure du serveur',
        'SEND_MESSAGE': 'Envoyer un message',
        'SAVE_WORLD': 'Faire une sauvegarde du serveur',
        'GIVE_ITEM': 'Donner un item à un joueur',
        'KILL_WILD': 'Tuer tous les dinos sauvages',
        'BAN_PLAYER': 'Bannir un joueur',
        'LOADING': 'Chargement',
        'CLEAR_RESULT': 'Supprimer les résultats',
        'CHANGE_BACKGROUND_RANDOM': 'Changer le fond d\'écran (aléatoire)',
        'LOGOUT': 'Déconnexion',
        'LOGIN': 'Connexion',
        'NAME': 'Nom',
        'LOOKING_FOR_ITEM': 'Rechercher un item...',
        'LOOKING_FOR_PLAYER': 'Rechercher un joueur...',
        'RELOAD_LIST_PLAYER': 'Recharger la liste des joueurs',
        'RELOAD_LIST_ITEM': 'Recharger la liste des items'
    });

    $translateProvider.preferredLanguage('fr');
}]);

app.controller('TranslationController', function ($scope, $translate) {
    $scope.changeLanguage = function (language){
        $translate.use(language);
    }
});