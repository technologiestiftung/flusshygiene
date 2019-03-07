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
const Bathingspot_1 = require("./Bathingspot");
let BathingspotModel = class BathingspotModel {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BathingspotModel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'text' }),
    __metadata("design:type", String)
], BathingspotModel.prototype, "rmodel", void 0);
__decorate([
    typeorm_1.ManyToOne(_type => Bathingspot_1.Bathingspot, bathingspot => bathingspot.models, {
        cascade: true,
    }),
    __metadata("design:type", Bathingspot_1.Bathingspot)
], BathingspotModel.prototype, "bathingspot", void 0);
BathingspotModel = __decorate([
    typeorm_1.Entity()
], BathingspotModel);
exports.BathingspotModel = BathingspotModel;
