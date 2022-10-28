"use strict";

var express = require("express"),
    router = express.Router(),
    config = require("../../../../config/environment"),
    utils = require("../../../libs/utils"),
    userDAO = require("../../core/dao/user-dao"),
    consts = require("../../../libs/consts");

router.get("/", function(req, res, next) {
    utils.destroySession(req);
    var token = req.query.token;

    if (!token) {
        res.cookie(consts.USER_COOKIE.STATUS_COOKIE_NAME,
            consts.SERVER_ERRORS.USER.INCORRECT_OR_EXPIRED_TOKEN,
            utils.getCookieOptionsDefault()
        );
        return utils.redirectToLoginPage(res);
    } else {
        userDAO.getUserByToken(consts.USER_TOKENS.SET_PASSWORD, token, function (err, findUser) {
            if (err) {
                //add to cookies
                res.cookie(consts.USER_COOKIE.STATUS_COOKIE_NAME, err.message,
                    utils.getCookieOptionsDefault());
                return utils.redirectToLoginPage(res);
            } else {
                var obj = {
                    token: token,
                    config: config.getMany("env", "cdn", "api")
                };
                res.render("setpassword", obj);
            }
        });
    }
});

module.exports = router;
