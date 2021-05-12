export function textUrl(textToCheck) {
    var text = textToCheck
    for (var i = 0; i < textToCheck.length; i++) {
        // text = text.replace(/(?:(?:\r\n|\r|\n)\s*){2}/gm, "");
        text = text.replace(/[\n]{2,}/gm, "\n\n");

    }

    // console.log(textToCheck);
    //note,	we	first	check	the	text	if	we	have	a	potential	link	with	this	Regex
    var expression = /(https?:\/\/)?[\w\-~]+(\.[\w\-~]+)+(\/[\w\-~@:%]*)*(#[\w\-]*)?(\?[^\s]*)?/gi;

    //and	then	we	make	sure	it	really	is	a	link	by	checking	if	it	is	one	of	the	common	topdomains
    var topDomains = [/\.com/, /\.de/, /\.org/, /\.net/, /\.us/, /\.co/, /\.edu/, /\.gov/, /\.biz/, /\.za/,
        /\.info/, /\.cc/, /\.ca/, /\.cn/, /\.fr/, /\.ch/, /\.au/, /\.in/, /\.jp/, /\.be/, /\.it/,
        /\.nl/, /\.uk/, /\.mx/, /\.no/, /\.ru/, /\.br/, /\.se/, /\.es/, /\.at/, /\.dk/, /\.eu/, /\.il/, /\.io/];

    var regex = new RegExp(expression);
    var lb = /\n/
    var match = ''; var splitText = []; var startIndex = 0; var linebreaks = ''
    var domainMatch = ''; var urlLength = 0; var abort = false;
    //this	algorithm	does	the	checking	AND	pushes	text	or	link	into	an	array
    while ((match = regex.exec(text)) != null) {
        // console.log(match);
        abort = true;
        //	we	need	to	double	check	if	this	is	one	of	the	"known"	topDomains	like	.com	
        for (var i = 0; i < topDomains.length; i++) {
            domainMatch = match[0].match(topDomains[i]);
            if (domainMatch) {
                // console.log("domainmatch", domainMatch, domainMatch[0].length, domainMatch.index);

                urlLength = domainMatch[0].length + domainMatch.index;

                //we found	one	of	the	domains	we	look for- now	we	need to	know if	the	.com or	.de	etc. is	at	the	VERY END of	the	domain
                if (match[0].length == urlLength) abort = false;
                if (match[0].length > urlLength) {
                    if (match[0].substr(urlLength, 1) == '/') abort = false;
                }
            }
        }
        //we	want	to	avoid	matching	email	addresses  (abc@gmail.com)
        if ((match.index != 0) && (text[match.index - 1] == '@')) {
            abort = true;
        }

        //we	want	to	avoid	matching	?	without	anything	at	the	end	like	www.epiloge.com/@axel-wittmann?
        if ((match.index != 0) && (text[match.index + match[0].length - 1] == '?')) {
            match[0] = match[0].substr(0, match[0].length - 1);
        }


        //we	always	put	in	the	last	text
        // splitText.push({ text: text.substr(startIndex, (match.index - startIndex)), type: 'text' });
        splitText.push(...checkHashTag(text.substr(startIndex, (match.index - startIndex))));

        //however,	based	on	the	match,	we	either	create	a	link,	or	no	link,	just	text
        // console.log("==", splitText, match, startIndex);

        if (abort) {
            splitText.push({ text: text.substr(match.index, (match[0].length)), type: 'text' });
        } else {
            var cleanedLink = text.substr(match.index, (match[0].length));
            cleanedLink = cleanedLink.replace(/^https?:\/\//, '');
            splitText.push({ text: cleanedLink, type: 'link' });
        }
        startIndex = match.index + (match[0].length);
    }

    // while ((linebreaks = lb.exec(text)) != null) {
    //     console.log(10);
    // }
    if (startIndex < text.length) splitText.push(...checkHashTag(text.substr(startIndex)));

    // if (startIndex < text.length) splitText.push({ text: text.substr(startIndex), type: 'text' });

    // console.log(splitText)

    return splitText;
}

// https://www.epiloge.com/detecting-external-links-in-a-paragraph-of-text-with-javascript-automatically-b1db50
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec

function checkHashTag(input) {
    const re = /#[0-9a-z]\w*\b/gi
    const result = []
    let startIndex = 0
    let match = ''
    while ((match = re.exec(input)) != null) {
        result.push({ text: input.substr(startIndex, (match.index - startIndex)), type: 'text' });
        result.push({ text: input.substr(match.index, match[0].length), type: 'hashtag' });
        startIndex = match.index + match[0].length;

    }
    if (startIndex < input.length) result.push({ text: input.substr(startIndex), type: 'text' });
    return result
}


// /[\n ]#[\w]+(?=\s)/g