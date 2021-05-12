let result;

export default async function resizeImage(data) {
    const reader = new FileReader();
    result = await new Promise((resolve, reject) => {
        reader.readAsDataURL(data);
        reader.onload = function (event) {
            const imgElement = document.createElement("img");
            imgElement.src = event.target.result;

            imgElement.onload = function (e) {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 550;

                const scaleSize = MAX_WIDTH / e.target.width;
                canvas.width = MAX_WIDTH;
                canvas.height = e.target.height * scaleSize;

                const ctx = canvas.getContext("2d");

                ctx.drawImage(e.target, 0, 0, canvas.width, canvas.height);

                const srcEncoded = ctx.canvas.toDataURL(e.target, "image/jpeg");

                resolve(srcEncoded)

            }
        }
    })

    return result

}