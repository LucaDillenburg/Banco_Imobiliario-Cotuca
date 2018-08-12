function Casa(nomeLugar, preco, qtdDinheiroMuda, qtdFelicidadeMuda)
{
	this.nomeLugar = nomeLugar;
	this.indexDono = -1;
	this.qtdFelicidadeMuda = qtdFelicidadeMuda;
	this.qtdDinheiroMuda = qtdDinheiroMuda;
	this.preco = preco;
}

Casa.prototype.getQtdDinheiroMuda = function()
{
	return parseFloat(this.qtdDinheiroMuda.toFixed(2));
}

Casa.prototype.getPreco = function()
{
	return parseFloat(this.preco.toFixed(2));
}

Casa.prototype.comprar = function(pers, index)
{
	if (this.preco > pers.dinheiro)
		return false;

	if(this.preco == 0)
		throw new Exception("Nao se pode comprar essa casa!");

	pers.dinheiro -= this.preco;
	this.indexDono = index;
	return true;
}