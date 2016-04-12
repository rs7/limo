const Handlebars = require('handlebars');

module.exports["error"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing;

  return "<div class=\"feed_error\">\n    Ошибка<br>\n    <pre>"
    + container.escapeExpression((helpers.escape || (depth0 && depth0.escape) || alias2).call(alias1,(helpers.json || (depth0 && depth0.json) || alias2).call(alias1,depth0,{"name":"json","hash":{},"data":data}),{"name":"escape","hash":{},"data":data}))
    + "</pre>\n</div>\n";
},"useData":true});

module.exports["feed_new_posts"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "Показать <b>"
    + alias3(((helper = (helper = helpers.count || (depth0 != null ? depth0.count : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"count","hash":{},"data":data}) : helper)))
    + "</b> "
    + alias3((helpers.num_decl || (depth0 && depth0.num_decl) || alias2).call(alias1,(depth0 != null ? depth0.count : depth0),"новых записей","новую запись","новые записи",{"name":"num_decl","hash":{},"data":data}))
    + "\n";
},"useData":true});

module.exports["feed_unfollower"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"feed_row\" id=\"feed_row_"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"feedback_grouped_row_wrap\">\n        <div class=\"feedback_grouped_row feedback_followers_row\">\n            <table class=\"feedback_row_t\" cellpadding=\"0\" cellspacing=\"0\">\n                <tbody>\n                    <tr>\n                        <td class=\"feedback_row_photo\">\n                            <div class=\"feedback_row_photo\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\">\n                                    <div class=\"feedback_photo_icon\"></div>\n                                    <img class=\"feedback_row_photo\" src=\""
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.photo_50 : stack1), depth0))
    + "\">\n                                </a>\n                            </div>\n                        </td>\n                        <td class=\"feedback_row_content\">\n                            <div class=\"feedback_row_group_names\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\" class=\"mem_link\">"
    + alias3((helpers.user_name_case || (depth0 && depth0.user_name_case) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),"nom",{"name":"user_name_case","hash":{},"data":data}))
    + "</a>\n                                "
    + alias3((helpers.item || (depth0 && depth0.item) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.sex : stack1),"отписалось","отписалась","отписался",{"name":"item","hash":{},"data":data}))
    + " от ваших обновлений\n                            </div>\n                            <div class=\"feedback_row_group_photos clear_fix\"></div>\n                            <div class=\"feedback_row_date\">\n                                <span>"
    + alias3((helpers.period || (depth0 && depth0.period) || alias2).call(alias1,(depth0 != null ? depth0.period : depth0),{"name":"period","hash":{},"data":data}))
    + "</span>\n                            </div>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n";
},"useData":true});

module.exports["feed_unfriend"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"feed_row\" id=\"feed_row_"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"feedback_grouped_row_wrap\">\n        <div class=\"feedback_grouped_row feedback_followers_row\">\n            <table class=\"feedback_row_t\" cellpadding=\"0\" cellspacing=\"0\">\n                <tbody>\n                    <tr>\n                        <td class=\"feedback_row_photo\">\n                            <div class=\"feedback_row_photo\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\">\n                                    <div class=\"feedback_photo_icon\"></div>\n                                    <img class=\"feedback_row_photo\" src=\""
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.photo_50 : stack1), depth0))
    + "\">\n                                </a>\n                            </div>\n                        </td>\n                        <td class=\"feedback_row_content\">\n                            <div class=\"feedback_row_group_names\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\" class=\"mem_link\">"
    + alias3((helpers.user_name_case || (depth0 && depth0.user_name_case) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),"nom",{"name":"user_name_case","hash":{},"data":data}))
    + "</a>\n                                "
    + alias3((helpers.item || (depth0 && depth0.item) || alias2).call(alias1,((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.sex : stack1),"удалило","удалила","удалил",{"name":"item","hash":{},"data":data}))
    + " вас из друзей\n                            </div>\n                            <div class=\"feedback_row_group_photos clear_fix\"></div>\n                            <div class=\"feedback_row_date\">\n                                <span>"
    + alias3((helpers.period || (depth0 && depth0.period) || alias2).call(alias1,(depth0 != null ? depth0.period : depth0),{"name":"period","hash":{},"data":data}))
    + "</span>\n                            </div>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n";
},"useData":true});

module.exports["feed_unlike_photo"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression, alias4=container.lambda;

  return "<div class=\"feed_row\" id=\"feed_row_"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"feedback_grouped_row_wrap\">\n        <div class=\"feedback_grouped_row feedback_like_row\">\n            <table class=\"feedback_row_t\" cellpadding=\"0\" cellspacing=\"0\">\n                <tbody>\n                    <tr>\n                        <td class=\"feedback_row_photo\">\n                            <div class=\"feedback_row_photo\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\">\n                                    <div class=\"feedback_photo_icon\"></div>\n                                    <img class=\"feedback_row_photo\" src=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.photo_50 : stack1), depth0))
    + "\">\n                                </a>\n                            </div>\n                        </td>\n                        <td class=\"feedback_row_content\">\n                            <div class=\"feedback_row_group_names\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\" class=\"mem_link\">"
    + alias3((helpers.user_name_case || (depth0 && depth0.user_name_case) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),"dat",{"name":"user_name_case","hash":{},"data":data}))
    + "</a>\n                                разонравилась ваша\n                                <a href=\""
    + alias3((helpers.photo_link || (depth0 && depth0.photo_link) || alias2).call(alias1,(depth0 != null ? depth0.photo : depth0),{"name":"photo_link","hash":{},"data":data}))
    + "\" target=\"_blank\">фотография</a>\n                            </div>\n                            <div class=\"feedback_row_group_photos clear_fix\"></div>\n                            <div class=\"feedback_row_date\">\n                                <span>"
    + alias3((helpers.period || (depth0 && depth0.period) || alias2).call(alias1,(depth0 != null ? depth0.period : depth0),{"name":"period","hash":{},"data":data}))
    + "</span>\n                            </div>\n                        </td>\n                        <td class=\"feedback_row_photo\">\n                            <div class=\"feedback_row_photo ta_r\">\n                                <a href=\""
    + alias3((helpers.photo_link || (depth0 && depth0.photo_link) || alias2).call(alias1,(depth0 != null ? depth0.photo : depth0),{"name":"photo_link","hash":{},"data":data}))
    + "\" target=\"_blank\">\n                                    <img class=\"feedback_row_photo\" src=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.photo : depth0)) != null ? stack1.photo_130 : stack1), depth0))
    + "\">\n                                </a>\n                            </div>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n";
},"useData":true});

module.exports["feed_unlike_post"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3=container.escapeExpression;

  return "<div class=\"feed_row\" id=\"feed_row_"
    + alias3(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === "function" ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\">\n    <div class=\"feedback_grouped_row_wrap\">\n        <div class=\"feedback_grouped_row feedback_like_row\">\n            <table class=\"feedback_row_t\" cellpadding=\"0\" cellspacing=\"0\">\n                <tbody>\n                    <tr>\n                        <td class=\"feedback_row_photo\">\n                            <div class=\"feedback_row_photo\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\">\n                                    <div class=\"feedback_photo_icon\"></div>\n                                    <img class=\"feedback_row_photo\" src=\""
    + alias3(container.lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.photo_50 : stack1), depth0))
    + "\">\n                                </a>\n                            </div>\n                        </td>\n                        <td class=\"feedback_row_content\">\n                            <div class=\"feedback_row_group_names\">\n                                <a href=\""
    + alias3((helpers.user_link || (depth0 && depth0.user_link) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),{"name":"user_link","hash":{},"data":data}))
    + "\" target=\"_blank\" class=\"mem_link\">"
    + alias3((helpers.user_name_case || (depth0 && depth0.user_name_case) || alias2).call(alias1,(depth0 != null ? depth0.user : depth0),"dat",{"name":"user_name_case","hash":{},"data":data}))
    + "</a>\n                                разонравилась ваша\n                                <a href=\""
    + alias3((helpers.post_link || (depth0 && depth0.post_link) || alias2).call(alias1,(depth0 != null ? depth0.post : depth0),{"name":"post_link","hash":{},"data":data}))
    + "\" target=\"_blank\">запись</a>\n                            </div>\n                            <div class=\"feedback_row_group_photos clear_fix\"></div>\n                            <div class=\"feedback_row_date\">\n                                <span>"
    + alias3((helpers.period || (depth0 && depth0.period) || alias2).call(alias1,(depth0 != null ? depth0.period : depth0),{"name":"period","hash":{},"data":data}))
    + "</span>\n                            </div>\n                        </td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n";
},"useData":true});