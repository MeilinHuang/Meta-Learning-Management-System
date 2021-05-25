/**
 * Comes from/based on COMP6080/2041
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 * 
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * 
 * MIME TYPE: https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
 * 
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl (file) {
    // const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg']
    console.log('received file: ', file)
    // TODO try different file types
    // const validFileTypes
    //     = ['image/jpeg', 'image/png', 'image/jpg',
    //         'video/mp4', 'audio/mp3', 'audio/mpeg', 'application/pdf', 'text/*']

    const validFileTypes
        = ['image/*',
            'video/*', 'audio/*', 'application/*', 'text/*']
    // jpg, png, mp3, mp4, pdf, + markdown and code files
    const valid = validFileTypes.find(type => type.split('/')[0] === file.type.split('/')[0]);
    // Bad data, let's walk away.
    if (!valid) {
        throw Error('provided file is not a png, jpg or jpeg image.');
    }

    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsDataURL(file);
    return dataUrlPromise;
}
