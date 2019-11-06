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
const types_interfaces_1 = require("../../lib/types-interfaces");
const class_validator_1 = require("class-validator");
let Region = class Region {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Region.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'enum', nullable: false, enum: types_interfaces_1.Regions }),
    class_validator_1.IsEnum(types_interfaces_1.Regions),
    __metadata("design:type", String)
], Region.prototype, "name", void 0);
__decorate([
    typeorm_1.OneToMany(_type => Bathingspot_1.Bathingspot, bathingspot => bathingspot.user, {
        cascade: true
    }),
    __metadata("design:type", Array)
], Region.prototype, "bathingspots", void 0);
Region = __decorate([
    typeorm_1.Entity()
], Region);
exports.Region = Region;
;
