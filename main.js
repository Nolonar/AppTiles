const canvas = document.getElementById("canvas");
const tilesPanel = document.getElementById("tiles-panel");
const rowsControl = document.getElementById("rows");

function createTile({ name, client, img }) {
    return createElement({
        element: "div",
        classes: ["tile"],
        children: [
            createElement({
                element: "div",
                classes: ["star"]
            }),
            createElement({
                element: "div",
                classes: ["content"],
                children: [
                    createElement({
                        element: "div",
                        classes: ["img"],
                        attributes: { style: `background-image: url('${img}');` }
                    }),
                    createElement({
                        element: "p",
                        classes: ["name"],
                        attributes: { innerText: name }
                    }),
                    createElement({
                        element: "p",
                        classes: ["client"],
                        attributes: { innerText: client }
                    })
                ]
            }),
            createElement({
                element: "div",
                classes: ["arrow"]
            })
        ]
    });
}

function createElement({ element = "", classes = [], children = [], attributes = {} }) {
    const result = document.createElement(element);
    for (const c of classes)
        result.classList.add(c);

    for (const child of children)
        result.appendChild(child);

    for (const attr in attributes)
        result[attr] = attributes[attr];

    return result;
}

[...document.getElementsByTagName("textarea")].forEach(t => {
    t.addEventListener("input", ({ target: { id, value } }) => {
        const platform = id;
        const group = document.querySelector(`div.group.${platform} > div.tiles`);
        group.textContent = "";
        if (value === "")
            return;

        let lines = value.split("\n");
        while (lines.length) {
            const [name, client, img, ...rest] = lines;
            group.appendChild(createTile({
                name: name,
                client: client,
                img: `img/${img}`
            }));

            while (rest.length && !rest[0].length)
                rest.shift();

            lines = rest;
        }
    });
    t.dispatchEvent(new Event("input"));
});

rowsControl.addEventListener("input", ({ target: { value } }) => {
    tilesPanel.className = "";
    tilesPanel.classList.add(`rows-${value}`);
});
rowsControl.dispatchEvent(new Event("input"));

document.getElementById("download-screenshot").addEventListener("click", () =>
    html2canvas(tilesPanel).then(c => {
        const ctx = canvas.getContext("2d");
        const { width, height } = canvas;
        const { width: w, height: h } = c;
        const ratio = Math.min(width / c.width, height / c.height);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(c, 0, 0, w, h, 0, 0, w * ratio, h * ratio);

        const link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    })
);