function Terreno(nomeLugar, preco, qtdDinheiroMuda, qtdFelicidadeMuda, precoPorCasa, qtdDinheiroMudaPorCasa, x, y)
{
	this.nomeLugar = nomeLugar;
	this.indexDono = -1;
	this.qtdFelicidadeMuda = qtdFelicidadeMuda;
	this._qtdDinheiroMuda = qtdDinheiroMuda;
	this._preco = preco;

	//casa
	this._precoPorCasa = precoPorCasa;
	this._qtdDinheiroMudaPorCasa = qtdDinheiroMudaPorCasa;
	this._qtdCasinhas = 0;

	//location
	this.x = x;
	this.y = y;
}


//getters
Terreno.prototype.getQtdDinheiroMudaTodasCasas = function()
{
	return this._qtdDinheiroMudaPorCasa*this._qtdCasinhas;
}

Terreno.prototype.getQtdDinheiroMuda = function()
{
	return this._qtdDinheiroMuda.toFixed(2);
}

Terreno.prototype.getAluguel = function()
{
	if(this._qtdDinheiroMuda > 0)
		throw "Nao eh aluguel!";
	return (-this._qtdDinheiroMuda).toFixed(2);
}

Terreno.prototype.getPreco = function()
{
	return this._preco.toFixed(2);
}

Terreno.prototype.getAdicionalAoAluguelPorCasinha = function()
{
	return (-this._qtdDinheiroMudaPorCasa).toFixed(2);
}

Terreno.prototype.getPrecoPorCasa = function()
{
	return this._precoPorCasa.toFixed(2);
}


//basico
Terreno.prototype.comprar = function(pers, index)
{
	if(this._preco == 0)
		throw "Nao se pode comprar esse terreno!";

	if (pers.dinheiro < this._preco)
		return false;

	pers.mudarDinheiro(-this._preco);
	pers.adicionarTerrenoAPropriedades(this.nomeLugar);
	this.indexDono = index;
	return true;
}

Terreno.prototype.naoTemMaisDono = function()
{
	this.indexDono = -1;
}


//casinhas
const NUMERO_MAX_CASINHAS = 4;
Terreno.prototype.comprarCasinha = function(pers)
{
	this._qtdCasinhas++;
	pers.mudarDinheiro(-this._precoPorCasa);
}

Terreno.prototype.podeComprarCasinhaParaEsseTerreno = function()
{
	return this._qtdCasinhas < NUMERO_MAX_CASINHAS;
}

Terreno.prototype.zerarCasinhas = function()
{
	this._qtdCasinhas = 0;
}
