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
const BathingspotRawModelData_1 = require("./BathingspotRawModelData");
const BathingspotModel_1 = require("./BathingspotModel");
const BathingspotPrediction_1 = require("./BathingspotPrediction");
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let Bathingspot = class Bathingspot {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Bathingspot.prototype, "id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", String)
], Bathingspot.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", String)
], Bathingspot.prototype, "apiEndpoints", void 0);
__decorate([
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", String)
], Bathingspot.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({ type: "json" }),
    __metadata("design:type", String)
], Bathingspot.prototype, "location", void 0);
__decorate([
    typeorm_1.ManyToOne(_type => User_1.User, user => user.bathingspots, {
        cascade: true,
    }),
    __metadata("design:type", User_1.User)
], Bathingspot.prototype, "user", void 0);
__decorate([
    typeorm_1.OneToMany(_type => BathingspotPrediction_1.BathingspotPrediction, (prediction) => prediction.bathingspot),
    __metadata("design:type", Array)
], Bathingspot.prototype, "predictions", void 0);
__decorate([
    typeorm_1.OneToMany(_type => BathingspotModel_1.BathingspotModel, (model) => model.bathingspot),
    __metadata("design:type", Array)
], Bathingspot.prototype, "models", void 0);
__decorate([
    typeorm_1.OneToMany(_type => BathingspotRawModelData_1.BathingspotRawModelData, (rawModelData) => rawModelData.bathingspot),
    __metadata("design:type", Array)
], Bathingspot.prototype, "rawModelData", void 0);
Bathingspot = __decorate([
    typeorm_1.Entity()
], Bathingspot);
exports.Bathingspot = Bathingspot;
