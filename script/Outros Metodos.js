String.prototype.replaceAll = function(strSearch, strReplace)
{
	return this.split(strSearch).join(strReplace);
}

//classe pra ajudar
class Ajustar
{
	static IntegerComSinal(n)
	{
		if(n > 0)
		    return "+" + n;
		else
	    	return n.toString();
	}

	static FloatToMoney(n)
	{
		return Math.floor(Math.abs(n) * 100) * (n < 0 ? -1 : 1) / 100;
	}
}
