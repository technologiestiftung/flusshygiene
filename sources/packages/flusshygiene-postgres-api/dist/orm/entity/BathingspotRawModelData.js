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
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Bathingspot_1 = require("./Bathingspot");
let BathingspotRawModelData = class BathingspotRawModelData {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BathingspotRawModelData.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", String)
], BathingspotRawModelData.prototype, "lastEdit", void 0);
__decorate([
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", String)
], BathingspotRawModelData.prototype, "rawData", void 0);
__decorate([
    typeorm_1.ManyToOne(_type => User_1.User, user => user.questionaires, {
        cascade: true,
    }),
    typeorm_1.ManyToOne(_type => Bathingspot_1.Bathingspot, bathingspot => bathingspot.rawModelData, {
        cascade: true,
    }),
    __metadata("design:type", Bathingspot_1.Bathingspot)
], BathingspotRawModelData.prototype, "bathingspot", void 0);
BathingspotRawModelData = __decorate([
    typeorm_1.Entity()
], BathingspotRawModelData);
exports.BathingspotRawModelData = BathingspotRawModelData;
