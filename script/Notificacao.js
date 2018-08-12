function Notificacao(texto, qtdDinheiroMuda, qtdFelicidadeMuda)
{
	this.textoNotific = texto;
	this.qtdFelicidadeMuda = qtdFelicidadeMuda;
	this.qtdDinheiroMuda = qtdDinheiroMuda;
}

Notificacao.prototype.getQtdDinheiroMuda = function()
{
	return parseFloat(this.qtdDinheiroMuda.toFixed(2));
}

Notificacao.prototype.fazerAlteracoesPers = function(pers)
{
	pers.mudarFelicidade(this.qtdFelicidadeMuda);
	pers.mudarDinheiro(this.qtdDinheiroMuda);
}