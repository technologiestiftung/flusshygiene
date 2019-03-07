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
const Bathingspot_1 = require("./Bathingspot");
const typeorm_1 = require("typeorm");
let BathingspotPrediction = class BathingspotPrediction {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], BathingspotPrediction.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", String)
], BathingspotPrediction.prototype, "timestamp", void 0);
__decorate([
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", String)
], BathingspotPrediction.prototype, "prediction", void 0);
__decorate([
    typeorm_1.ManyToOne(_type => Bathingspot_1.Bathingspot, bathingspot => bathingspot.predictions, {
        cascade: true,
    }),
    __metadata("design:type", Bathingspot_1.Bathingspot)
], BathingspotPrediction.prototype, "bathingspot", void 0);
BathingspotPrediction = __decorate([
    typeorm_1.Entity()
], BathingspotPrediction);
exports.BathingspotPrediction = BathingspotPrediction;
