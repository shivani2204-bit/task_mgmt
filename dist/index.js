import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bcryptjs from "bcryptjs";
import cors from "cors";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs";

// Database configuration
import './config/db.js';

export{
    express,
    dotenv,
    bcryptjs,
    cors,
    JWT,
    mongoose,
    multer,
    nodemailer,
    path,
    fs
}