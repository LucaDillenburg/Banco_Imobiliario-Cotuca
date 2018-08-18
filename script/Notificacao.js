function Notificacao(texto, qtdDinheiroMuda, qtdFelicidadeMuda)
{
	this.textoNotific = texto;
	this.qtdFelicidadeMuda = qtdFelicidadeMuda;
	this._qtdDinheiroMuda = qtdDinheiroMuda;
}

Notificacao.prototype.getQtdDinheiroMuda = function()
{
	return this._qtdDinheiroMuda.toFixed(2);
}

Notificacao.prototype.getStrDinheiroQtdDinheiroMuda = function()
{
	return (this._qtdDinheiroMuda>0?"+":"-") + "R$" + Math.abs(this._qtdDinheiroMuda).toFixed(2);
}

Notificacao.prototype.fazerAlteracoesPers = function(pers)
{
	pers.mudarFelicidade(this.qtdFelicidadeMuda);
	pers.mudarDinheiro(this._qtdDinheiroMuda);
}