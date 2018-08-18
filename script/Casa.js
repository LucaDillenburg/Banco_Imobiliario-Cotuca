function Casa(nomeLugar, preco, qtdDinheiroMuda, qtdFelicidadeMuda)
{
	this.nomeLugar = nomeLugar;
	this.indexDono = -1;
	this.qtdFelicidadeMuda = qtdFelicidadeMuda;
	this._qtdDinheiroMuda = qtdDinheiroMuda;
	this._preco = preco;
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
	if (this._preco > pers.dinheiro)
		return false;

	if(this._preco == 0)
		throw new Exception("Nao se pode comprar essa casa!");

	pers.dinheiro -= this._preco;
	this.indexDono = index;
	return true;
}
