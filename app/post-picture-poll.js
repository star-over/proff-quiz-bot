"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.postPicturePoll = void 0;
var grammy_1 = require("grammy");
var server_1 = require("react-dom/server");
var utils_js_1 = require("./lib/utils.js");
var render_js_1 = require("./puppeteer/render.js");
var card1_js_1 = require("./templates/card1.js");
function postPicturePoll(ctx, quiz) {
    return __awaiter(this, void 0, void 0, function () {
        var question, answers, reference, botName, botDescription, pollQuestion, answersWithProxies, pollAnswersProxy, cardProps, jsx, html, picture, pictureResponse, pollConfig;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    question = quiz.question, answers = quiz.answers, reference = quiz.reference;
                    botName = process.env.BOT_NAME;
                    botDescription = process.env.BOT_DESCRIPTION;
                    pollQuestion = (0, utils_js_1.extractText)(question);
                    answersWithProxies = answers
                        .map(function (answer, i) { return (__assign(__assign({}, answer), { proxy: utils_js_1.proxies[i] })); });
                    pollAnswersProxy = answersWithProxies
                        .map(function (_a) {
                        var proxy = _a.proxy;
                        return proxy !== null && proxy !== void 0 ? proxy : "";
                    });
                    cardProps = __assign(__assign({}, quiz), { botName: botName, botDescription: botDescription, answers: answersWithProxies });
                    jsx = (0, card1_js_1.Card1)(cardProps);
                    html = (0, server_1.renderToStaticMarkup)(jsx);
                    return [4 /*yield*/, (0, render_js_1.render)(html)];
                case 1:
                    picture = _a.sent();
                    return [4 /*yield*/, ctx.replyWithPhoto(new grammy_1.InputFile(picture))];
                case 2:
                    pictureResponse = _a.sent();
                    pollConfig = {
                        type: "quiz",
                        correct_option_id: answersWithProxies.findIndex(function (_a) {
                            var isCorrect = _a.isCorrect;
                            return isCorrect;
                        }),
                        explanation: reference,
                        explanation_parse_mode: "HTML",
                        reply_to_message_id: pictureResponse.message_id
                    };
                    return [4 /*yield*/, ctx.replyWithPoll(pollQuestion, pollAnswersProxy, pollConfig)];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.postPicturePoll = postPicturePoll;
