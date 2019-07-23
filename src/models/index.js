import Datastore from 'nedb';

export const Terminal = new Datastore({
    filename: path.resolve(__dirname, '../databases/terminal1.db'),
    autoload: true
 });

export const Terminal2 = new Datastore({
    filename: path.resolve(__dirname, '../databases/terminal2.db'),
    autoload: true
 });

export const Terminal3 = new Datastore({
    filename: path.resolve(__dirname, '../databases/terminal3.db'),
    autoload: true
 });

export const Terminal4 = new Datastore({
    filename: path.resolve(__dirname, '../databases/terminal4.db'),
    autoload: true
 });

export const Tank = new Datastore({
    filename: path.resolve(__dirname, '../databases/tank.db'),
    autoload: true
 });

export const TerminalStates = new Datastore({
    filename: path.resolve(__dirname, '../databases/terminal-states.db'),
    autoload: true
 });

export const Billings = new Datastore({
    filename: path.resolve(__dirname, '../databases/billings.db'),
    autoload: true
 });
