function Casa(nomeLugar, preco, qtdDinheiroMuda, qtdFelicidadeMuda, x, y)
{
	this.nomeLugar = nomeLugar;
	this.indexDono = -1;
	this.qtdFelicidadeMuda = qtdFelicidadeMuda;
	this._qtdDinheiroMuda = qtdDinheiroMuda;
	this._preco = preco;

	//location
	this.x = x;
	this.y = y;
}

Casa.prototype.getQtdDinheiroMuda = function()
{
	return this._qtdDinheiroMuda.toFixed(2);
}

Casa.prototype.getAluguel = function()
{
	if(this._qtdDinheiroMuda > 0)
		throw new Exception("Nao eh aluguel!");
	return (-this._qtdDinheiroMuda).toFixed(2);
}

Casa.prototype.getPreco = function()
{
	return this._preco.toFixed(2);
}

Casa.prototype.comprar = function(pers, index)
{
	if(this._preco == 0)
		throw new Exception("Nao se pode comprar essa casa!");

	if (pers.dinheiro < this._preco)
		return false;

	pers.mudarDinheiro(-this._preco);
	pers.adicionarCasaAPropriedades(this.nomeLugar);
	this.indexDono = index;
	return true;
}
