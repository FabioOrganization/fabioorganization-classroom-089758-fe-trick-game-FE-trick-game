const index = require('./index.js');
const fs = require('fs');
const path = require('path');
function mazoEstandar() {
    const data = fs.readFileSync(path.join(__dirname, 'db.json'), 'utf-8');
    return JSON.parse(data).cartas;
}

describe('Truco reducido - Tests unitarios', () => {
    beforeAll(() => {
        const html = fs.readFileSync(path.resolve(__dirname, "index.html"), "utf8");
        document.documentElement.innerHTML = html;
    });
    beforeEach(() => {
        global.fetch = jest.fn(()=>Promise.resolve({json:()=>Promise.resolve([])}));
        globalThis.manos = [[{id: 'A'}, {id: 'B'}, {id: 'C'}], [{id: 'X'}, {id: 'Y'}, {id: 'Z'}]];
        globalThis.rondas = [];
        globalThis.turno = 0;
        globalThis.puntajeRondas = [0, 0];
        jest.clearAllMocks?.();

    });

    test('obtenerMazoPorFetch llama a /cartas con GET', async () => {
        await index.obtenerMazoPorFetch();
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/cartas'));
    });

    test('guardarPartidaFetch llama a /partidas por POST y envía datos', async () => {
        await index.guardarPartidaFetch(0);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining('/partidas'),
            expect.objectContaining({method:'POST'})
        );
    });

    test('getHistorialPartidasFetch llama a /partidas con GET', async () => {
        await index.getHistorialPartidasFetch();
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/partidas'));
    });

    test('mezclar desordena el array pero no quita/duplica cartas', () => {
        const mazo = mazoEstandar();
        const copia = [...mazo];
        const mezclado = index.mezclar([...copia]);
        expect(mezclado.sort((a,b)=>a.valor-b.valor||a.palo.localeCompare(b.palo)))
            .toEqual(mazo.sort((a,b)=>a.valor-b.valor||a.palo.localeCompare(b.palo)));
        expect(mezclado.length).toBe(40);
        expect(new Set(mezclado.map(c=>c.valor+'-'+c.palo)).size).toBe(40);
    });

    test('repartirManos reparte 3 cartas a cada uno y quita del mazo', () => {
        mazo = mazoEstandar();
        index.repartirManos();
        expect(manos[0].length).toBe(3);
        expect(manos[1].length).toBe(3);
        expect(mazo.length).toBe(34);
    });

    test('jerarquiaCarta coloca 1 de espadas < 1 de bastos < 7 de espadas', () => {
        const unoE = {valor:1,palo:'Espadas'};
        const unoB = {valor:1,palo:'Bastos'};
        const sieteE = {valor:7,palo:'Espadas'};
        const tresO = {valor:3,palo:'Oros'};
        const cuatroC = {valor:4,palo:'Copas'};
        expect(index.jerarquiaCarta(unoE)).toBe(0);
        expect(index.jerarquiaCarta(unoB)).toBe(1);
        expect(index.jerarquiaCarta(sieteE)).toBe(2);
        expect(index.jerarquiaCarta(tresO)).toBe(4);
        expect(index.jerarquiaCarta(cuatroC)).toBe(14);
    });

    test('ganadorRonda detecta el ganador correctamente o empate', () => {
        let r = {carta1: {valor:1,palo:'Espadas'}, carta2: {valor:3,palo:'Espadas'}};
        expect(index.ganadorRonda(r)).toBe(0);
        r = {carta1: {valor:4,palo:'Copas'}, carta2: {valor:1,palo:'Bastos'}};
        expect(index.ganadorRonda(r)).toBe(1);
        r = {carta1: {valor:3,palo:'Copas'}, carta2: {valor:3,palo:'Oros'}};
        expect(index.ganadorRonda(r)).toBe(-1);
    });


    test('quita carta de la mano y la almacena en la ronda', () => {
        index.jugarCarta(0, 1);
        expect(globalThis.manos[0]).toEqual([{id: 'A'}, {id: 'C'}]);
        expect(globalThis.rondas[0].carta1).toEqual({id: 'B'});
    });

    test('crea nueva ronda si no hay', () => {
        index.jugarCarta(0, 0);
        expect(globalThis.rondas.length).toBe(1);
        expect(globalThis.rondas[0].carta1).toEqual({id:'A'});
    });

    test('no crea nueva ronda si ronda incompleta', () => {
        index.jugarCarta(0, 0); // J1
        index.jugarCarta(1, 0); // J2
        index.jugarCarta(0, 0); // J1 segunda jugada
        expect(globalThis.rondas.length).toBe(2);
        expect(globalThis.rondas[1].carta1).toEqual({id:'B'}); // segunda jugada
    });

   test('cuando ambos juegan, se determina el ganador y suma puntos', () => {
       globalThis.manos = [
           [{ valor: 3, palo: 'Espadas' }], // J1
           [{ valor: 1, palo: 'Espadas' }]  // J2
       ];
       globalThis.rondas = [];
       index.jugarCarta(0, 0); // J1 juega
       index.jugarCarta(1, 0); // J2 juega
       expect(globalThis.rondas[0].ganador).toBe(1); // J2 gana
       expect(globalThis.puntajeRondas[1]).toBe(1);  // J2 suma puntos
   });
    test('pasa el turno al siguiente', () => {
        index.jugarCarta(0, 0);
        expect(globalThis.turno).toBe(1);
        index.jugarCarta(1, 0);
        expect(globalThis.turno).toBe(0);
    });

    test('ganadorPartida detecta el que gana dos rondas', () => {
        puntajeRondas[0] = 2;
        expect(index.ganadorPartida()).toBe(0);
        puntajeRondas[0] = 0; puntajeRondas[1]=2;
        expect(index.ganadorPartida()).toBe(1);
        puntajeRondas[0]=1;puntajeRondas[1]=1;
        expect(index.ganadorPartida()).toBe(null);
    });

});