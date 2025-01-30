"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchService = void 0;
const common_1 = require("@nestjs/common");
const player_service_1 = require("../player/player.service");
const event_emitter_1 = require("@nestjs/event-emitter");
let MatchService = class MatchService {
    constructor(playerService, eventEmitter) {
        this.playerService = playerService;
        this.eventEmitter = eventEmitter;
    }
    async handleMatchResult(matchResultDto) {
        const { winner, loser, draw } = matchResultDto;
        let winnerPlayer = await this.playerService.findOne(winner);
        let loserPlayer = await this.playerService.findOne(loser);
        if (!winnerPlayer || !loserPlayer) {
            throw new Error('One or both players not found');
        }
        const K = 32;
        const WeWinner = 1 / (1 + Math.pow(10, (loserPlayer.rank - winnerPlayer.rank) / 400));
        const WeLoser = 1 / (1 + Math.pow(10, (winnerPlayer.rank - loserPlayer.rank) / 400));
        if (draw) {
            const winnerNewrank = winnerPlayer.rank + K * (0.5 - WeWinner);
            const loserNewrank = loserPlayer.rank + K * (0.5 - WeLoser);
            await this.playerService.updatePlayerRank(winner, Math.round(winnerNewrank));
            await this.playerService.updatePlayerRank(loser, Math.round(loserNewrank));
        }
        else {
            const winnerNewrank = winnerPlayer.rank + K * (1 - WeWinner);
            const loserNewrank = loserPlayer.rank + K * (0 - WeLoser);
            await this.playerService.updatePlayerRank(winner, Math.round(winnerNewrank));
            await this.playerService.updatePlayerRank(loser, Math.round(loserNewrank));
        }
        winnerPlayer = await this.playerService.findOne(winner);
        loserPlayer = await this.playerService.findOne(loser);
        if (winnerPlayer) {
            this.eventEmitter.emit('match.result', {
                player: {
                    id: winnerPlayer.id,
                    rank: winnerPlayer.rank
                }
            });
        }
        if (loserPlayer) {
            this.eventEmitter.emit('match.result', {
                player: {
                    id: loserPlayer.id,
                    rank: loserPlayer.rank
                }
            });
        }
    }
};
exports.MatchService = MatchService;
exports.MatchService = MatchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [player_service_1.PlayerService,
        event_emitter_1.EventEmitter2])
], MatchService);
//# sourceMappingURL=match.service.js.map