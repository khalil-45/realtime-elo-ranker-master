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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const player_entity_1 = require("../entities/player.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
let PlayerService = class PlayerService {
    constructor(playerRepository, eventEmitter) {
        this.playerRepository = playerRepository;
        this.eventEmitter = eventEmitter;
        this.ranks = {};
    }
    async createPlayer(createPlayerDto) {
        const player = this.playerRepository.create({
            id: createPlayerDto.id,
            rank: createPlayerDto.initialRank ?? 1000,
        });
        const savedPlayer = await this.playerRepository.save(player);
        this.ranks[savedPlayer.id] = savedPlayer.rank;
        this.eventEmitter.emit('player.created', savedPlayer);
        return savedPlayer;
    }
    async updaterank(playerId, newrank) {
        const player = await this.playerRepository.findOne({ where: { id: playerId } });
        if (!player) {
            throw new Error('Player not found');
        }
        player.rank = newrank;
        const updatedPlayer = await this.playerRepository.save(player);
        this.ranks[updatedPlayer.id] = updatedPlayer.rank;
        this.eventEmitter.emit('player.updated', updatedPlayer);
        return updatedPlayer;
    }
    async getPlayers() {
        return this.playerRepository.find();
    }
    async initializeranks() {
        const players = await this.playerRepository.find();
        players.forEach(player => {
            this.ranks[player.id] = player.rank;
        });
    }
    async handleMatchResult(matchResultDto) {
        const { winner, loser, draw } = matchResultDto;
        let winnerPlayer = await this.playerRepository.findOne({ where: { id: winner } });
        let loserPlayer = await this.playerRepository.findOne({ where: { id: loser } });
        if (!winnerPlayer || !loserPlayer) {
            throw new Error('One or both players not found');
        }
        const K = 32;
        const WeWinner = 1 / (1 + Math.pow(10, (loserPlayer.rank - winnerPlayer.rank) / 400));
        const WeLoser = 1 / (1 + Math.pow(10, (winnerPlayer.rank - loserPlayer.rank) / 400));
        if (draw) {
            const winnerNewrank = winnerPlayer.rank + K * (0.5 - WeWinner);
            const loserNewrank = loserPlayer.rank + K * (0.5 - WeLoser);
            await this.updaterank(winner, Math.round(winnerNewrank));
            await this.updaterank(loser, Math.round(loserNewrank));
        }
        else {
            const winnerNewrank = winnerPlayer.rank + K * (1 - WeWinner);
            const loserNewrank = loserPlayer.rank + K * (0 - WeLoser);
            await this.updaterank(winner, Math.round(winnerNewrank));
            await this.updaterank(loser, Math.round(loserNewrank));
        }
        winnerPlayer = await this.playerRepository.findOne({ where: { id: winner } });
        loserPlayer = await this.playerRepository.findOne({ where: { id: loser } });
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
exports.PlayerService = PlayerService;
exports.PlayerService = PlayerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_entity_1.Player)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], PlayerService);
//# sourceMappingURL=player.service.js.map