const symbols = ['@', '#', '$', '&', '^', '*', '=', '+', 'X', '£', '€', '¥', '¢', '¶', 'µ'];
const nodes = document.querySelectorAll('.anima-text');

function animaText(node, text) {
    let value = '';
    const isLong = text.length > 200;
    const delay = isLong ? 0 : 50;

    const gapSize = 150;
    const encodeStepSize = isLong ? Math.floor(text.length / gapSize) : 1;
    const decodeStepSize = isLong ? Math.floor(text.length / gapSize * 0.5) : 1;

    const codeGen = (count) => {
        let code = '';

        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * symbols.length);
            code += symbols[randomIndex];
        }
        return code;
    }
    const encodeText = async (countSymbols) => {
        if (countSymbols % encodeStepSize !== 0) return;
        await new Promise(resolve => setTimeout(resolve, delay));
        value = codeGen(countSymbols);
        node.setAttribute('data-after-content', value);
    }
    const decodeText = async (countSymbols, isReverse) => {
        if (countSymbols % decodeStepSize !== 0 && text.length - countSymbols > gapSize) return;
        await new Promise(resolve => setTimeout(resolve, delay));

        const replaceIndex = text.length - countSymbols;
        const particleCode = codeGen(replaceIndex);

        if (isReverse) {
            value = particleCode + text.slice(replaceIndex);
        } else {
            value = text.slice(0, countSymbols) + particleCode;
        }

        node.setAttribute('data-after-content', value);
    }

    return {encodeText, decodeText}
}

async function animaInit(node) {
    const text = node.outerText;
    const countArr = [...text, ...text].map((_, i) => i);
    const {encodeText, decodeText} = animaText(node, text);

    for (const count of countArr) {
        const i = countArr.indexOf(count);

        if (i < text.length) {
            await encodeText(i);
        } else {
            await decodeText(i - text.length + 1, false);
        }
    }
}

nodes.forEach((node) => {
    node.setAttribute('data-after-content', '');
    animaInit(node).finally(() => {
        node.style.setProperty('--color', 'aquamarine')
    });
});
