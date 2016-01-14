/**
 * Created by Lucas on 12/05/2015.

 function displayMessage(message, type){
    if (message == null){
        message = "Une erreur est survenue.";
    }
    if (type == null){
        type = "error";
    }
    var act = $("#result-error");
    var act_content = $("#result-error-content");
    act.addClass(type).addClass("bounceIn").show();
    act_content.html(message).addClass("bounceIn").show();
    setTimeout(function(){
        act_content.removeClass("bounceIn").addClass("bounceOut").delay(700).hide(0);
        act.removeClass("bounceIn").addClass("bounceOut").delay(700).hide(0);
        refactorMessageContainer(act);
        refactorMessageContainer(act_content);
    },5000);
}

 function refactorMessageContainer(target){
    setTimeout(function(){
        target.html('').removeClass();
    },700);
}*/

MessageHandler = {
    displayMessage: function (args) {
        var selector = args.selector || "#message";
        var msg = args.msg;
        var animation = args.animate || "shake2";
        var type = args.type || "error";

        $(selector).html("<div class='"+type+"'>"+msg+"</div>").addClass(animation);
    }
};