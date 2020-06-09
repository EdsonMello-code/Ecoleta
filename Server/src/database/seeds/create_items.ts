import Knex from 'knex'

export async function seed(knex: Knex) {
    await knex('items').insert([
        {title: "Lâmpadas", image: 'lampadas.svg'},
        {title: "Pilhas e Baterias", image: 'baterias.svg'},
        {title: "Papéis", image: 'papeis-papelao.svg'},
        {title: "Residuos Eletrônicos", image: 'eletronicos.svg'},
        {title: "Residuos Orgânicos", image: 'organicos.svg'},
        {title: "Óleo de conzinha", image: 'oleo.svg'},



    ]);
}