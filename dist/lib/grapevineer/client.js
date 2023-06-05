"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFlowerMeaningByDate = exports.getAllPlayers = void 0;
const grpc = __importStar(require("@grpc/grpc-js"));
const grapevineer_grpc_pb_1 = require("grapevineer/gen/ts/grapevineer/grapevineer_grpc_pb");
const grapevineer_pb_1 = require("grapevineer/gen/ts/grapevineer/grapevineer_pb");
const grpcClient = new grapevineer_grpc_pb_1.GrapevineerClient('grapevineer-grpc.fly.dev:443', grpc.credentials.createInsecure());
const getAllPlayers = async () => {
    const request = new grapevineer_pb_1.GetAllPlayersRequest();
    let players = [];
    return new Promise((resolve, reject) => {
        grpcClient.getAllPlayers(request, (err, response) => {
            if (err || response === null) {
                console.error(err);
                reject([]);
            }
            players = [...response.getPlayersList()];
            resolve(players);
        });
    });
};
exports.getAllPlayers = getAllPlayers;
const getFlowerMeaningByDate = async (date) => {
    const request = new grapevineer_pb_1.GetFlowerMeaningByDateRequest();
    if (date != undefined) {
        request.setDate(date);
    }
    return new Promise((resolve, reject) => {
        grpcClient.getFlowerMeaningByDate(request, (err, response) => {
            if (err || response === null) {
                console.error(err);
                reject(null);
            }
            resolve(response?.toObject());
        });
    });
};
exports.getFlowerMeaningByDate = getFlowerMeaningByDate;
