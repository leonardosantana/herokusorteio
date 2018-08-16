var socket = io.connect();
let users = [];
let createdRaffle;

$("#enter-one-raffle").show();
$("#create-a-raffle").hide();
$("#raffle").hide();

function sortWinner() {

    let winner = users[getRandomWinner()];

    socket.emit('raffleWinners', { raffle: createdRaffle, user: winner })

    items = [];

    users.forEach(element => {
        if (element == winner)
            items.push('<li class="list-group-item list-group-item-action list-group-item-success">' + element + ' was the winner' + '</li>');
        else
            items.push('<li class="list-group-item list-group-item-action list-group-item-danger">' + element + ' It wasnt our day.' + '</li>');
    });

    $("ol#raffle-users").empty().html(items.join(""));


};

function enterRaffle() {
    $("#btn-enter-raffle").prop("disabled", true);
    let enterRaffleId = $("#ipt-enter-raffle").val();
    let userRaffleId = $("#ipt-user-name").val();
    console.log(enterRaffleId);
    socket.emit('enterRaffle', { raffle: enterRaffleId, user: userRaffleId })
};

function createRaffle() {
    let raffleId = getRandomRaffleId();
    $("#btn-create-raffle").prop("disabled", true);
    socket.emit('createRaffle', { raffle: raffleId });

}

function getRandomWinner() {
    return Math.floor(Math.random() * users.length);
}

function getRandomRaffleId() {
    let letters = '0123456789ABCDEF';
    let raffle = '#';
    for (var i = 0; i < 6; i++) {
        raffle += letters[Math.floor(Math.random() * 16)];
    }
    return raffle;
}

socket.on('enteredRaffle', (data) => {

    $("#enter-one-raffle").hide();
    $("#raffle").show();

    let items = [];

    users = data;

    console.log('data received' + data);

    data.forEach(element => {
        items.push('<li class="list-group-item list-group-item-action list-group-item-info">' + element + '</li>');
    });

    $("ol#raffle-users").empty().html(items.join(""));

});

socket.on('win', (data) => {
    $("h1#raffle-entered-result").empty().html('You win');
});

socket.on('createdRaffle', (data) => {
    console.log(data.msg + ' ' + data.raffleId);

    $("#enter-one-raffle").hide();
    $("#raffle").show();

    createdRaffle = data.raffleId;

    $("h1#raffle-id").empty().html('Your raffle was created! Share the ' + data.raffleId + ' to connect users');
});

socket.on('loose', (data) => {
    $("h1#raffle-entered-result").empty().html('It wasnt our day.');
});

socket.on('raffleNotFound', (data) => {

    $("#enter-one-raffle").show();
    $("#raffle").hide();

    $("h1#raffle-entered-result").empty().html('This raffle doesnt exists');
});

socket.on('userLogged', (data) => {

    $("#enter-one-raffle").show();
    $("#raffle").hide();
    $("#btn-enter-raffle").prop("disabled", false);

    $("h1#raffle-entered-result").empty().html('Enter with another user name');
});

socket.on('enteredRaffleUser', (data) => {

    $("#enter-one-raffle").show();
    $("#raffle").hide();

    $("h1#raffle-entered-result").empty().html('You entered in raffle');
});