String.prototype.replaceAll = function(strSearch, strReplace)
{
	return this.split(strSearch).join(strReplace);
};