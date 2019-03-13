"use strict";
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
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
const User_1 = require("./User");
const typeorm_1 = require("typeorm");
let Questionaire = class Questionaire {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Questionaire.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ type: 'json' }),
    __metadata("design:type", String)
], Questionaire.prototype, "state", void 0);
__decorate([
    typeorm_1.Column({ type: 'timestamp' }),
    __metadata("design:type", String)
], Questionaire.prototype, "lastEdit", void 0);
__decorate([
    typeorm_1.ManyToOne((_type) => User_1.User, user => user.questionaires, {
        cascade: true,
    }),
    __metadata("design:type", User_1.User)
], Questionaire.prototype, "user", void 0);
Questionaire = __decorate([
    typeorm_1.Entity()
], Questionaire);
exports.Questionaire = Questionaire;
