(function () {
    const nombreBD = "tablon_ulima_local";
    const almacén = "fotos";

    function abrirBD() {
        return new Promise((resolve, reject) => {
            const solicitud = indexedDB.open(nombreBD, 1);
            solicitud.onupgradeneeded = () => {
                const db = solicitud.result;
                if (!db.objectStoreNames.contains(almacén)) db.createObjectStore(almacén, { keyPath: "id" });
            };
            solicitud.onsuccess = () => resolve(solicitud.result);
            solicitud.onerror = () => reject(solicitud.error);
        });
    }

    async function guardar(idAviso, archivos) {
        const db = await abrirBD();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(almacén, "readwrite");
            const store = tx.objectStore(almacén);
            const indice = store.openCursor();
            indice.onsuccess = () => {
                const cursor = indice.result;
                if (!cursor) {
                    archivos.forEach((archivo, orden) => store.put({ id: `${idAviso}-${orden}`, idAviso, orden, archivo }));
                    return;
                }
                if (cursor.value.idAviso === idAviso) cursor.delete();
                cursor.continue();
            };
            tx.oncomplete = () => { db.close(); resolve(); };
            tx.onerror = () => { db.close(); reject(tx.error); };
        });
    }

    async function listar(idAviso) {
        const db = await abrirBD();
        return new Promise((resolve, reject) => {
            const tx = db.transaction(almacén, "readonly");
            const req = tx.objectStore(almacén).getAll();
            req.onsuccess = () => resolve(req.result.filter((foto) => foto.idAviso === idAviso).sort((a, b) => a.orden - b.orden).map((foto) => foto.archivo));
            req.onerror = () => reject(req.error);
            tx.oncomplete = () => db.close();
        });
    }

    window.TablonFotos = { guardar, listar };
}());
