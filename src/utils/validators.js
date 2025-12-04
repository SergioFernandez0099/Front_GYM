/**
 * validaYSanitiza
 * @param {string} input - cadena a validar/sanitizar
 * @param {Object} options
 *  - allowSpecial {boolean} default false -> si true permite caracteres especiales
 *  - maxLength {number|null} default null -> longitud máxima permitida
 * @returns {{ valid: boolean, sanitized: string, errors: string[] }}
 */
export const validaYSanitiza = (
    input,
    {allowSpecial = false, maxLength = null} = {}
) => {
    const errors = [];

    if (typeof input !== "string") {
        return {
            valid: false,
            sanitized: "",
            errors: ["El valor debe ser una cadena (string)."],
        };
    }

    // 1) trim y comprobación de vacío
    const trimmed = input.trim();
    if (trimmed.length === 0) {
        errors.push("La cadena está vacía.");
    }

    // 2) longitud máxima (opcional)
    if (
        Number.isInteger(maxLength) &&
        maxLength > 0 &&
        trimmed.length > maxLength
    ) {
        errors.push(
            `La cadena excede la longitud máxima de ${maxLength} caracteres.`
        );
    }

    // 3) comprobación de caracteres especiales (si no están permitidos)
    // Permitimos letras (Unicode), dígitos, espacios, guion bajo y guion medio por defecto.
    if (!allowSpecial) {
        // ^[\p{L}\p{N}\s_-]+$  -> letras, números, espacios, underscore y guion
        // Permite letras, números, espacios, guion y guion bajo en cualquier orden
        const noSpecialRe = /^[\p{L}\p{N}\s/_-]+$/u;
        // usamos test en trimmed; si falla, añadimos error
        if (!noSpecialRe.test(trimmed)) {
            errors.push("Contiene caracteres especiales no permitidos.");
        }
    }

    // 4) sanitización HTML/JS básica:
    //    - eliminamos tags <script>...</script>
    //    - eliminamos atributos on* (onload, onclick...) dentro de tags teóricos
    //    - escapamos entidades HTML
    let sanitized = trimmed
        // eliminar bloques <script>...</script> (caso-insensible, multilinea)
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
        // quitar event handlers inline (ej: onerror="...") aproximado
        .replace(/\son\w+\s*=\s*(['"`]).*?\1/gi, "")
        // quitar etiquetas HTML completas (dejamos solo el texto): <tag ...> -> ''
        .replace(/<\/?[a-z][\s\S]*?>/gi, "");

    // 5) escape de entidades HTML (para evitar XSS cuando se ponga en HTML)
    const escapeHtml = (str) =>
        str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/\//g, "&#x2F;");

    sanitized = escapeHtml(sanitized);

    // 6) limpieza básica contra patrones SQL comunes (muy básica — ver nota)
    //    Eliminamos patrones como ;--, /*...*/, DROP TABLE, OR '1'='1' (aprox.)
    //    **No** confiar sólo en esto: usar always consultas parametrizadas.
    const sqlDangerPatterns = [
        /--/g,
        /;\s*$/g,
        /\/\*[\s\S]*?\*\//g,
        /\bUNION\b/gi,
        /\bSELECT\b/gi,
        /\bINSERT\b/gi,
        /\bUPDATE\b/gi,
        /\bDELETE\b/gi,
        /\bDROP\b/gi,
        /(\bor\b|\band\b)\s+['"]?1['"]?\s*=\s*['"]?1['"]?/gi,
    ];

    sqlDangerPatterns.forEach((pat) => {
        if (pat.test(sanitized)) {
            // sustituimos coincidencias por una versión segura (removemos)
            sanitized = sanitized.replace(pat, "");
            // añadimos un error indicativo (no revelador)
            if (!errors.includes("Patrón potencial de inyección SQL detectado.")) {
                errors.push("Patrón potencial de inyección SQL detectado.");
            }
        }
    });

    const valid = errors.length === 0;

    return {valid, sanitized, errors};
};

// Valida que el valor recibido sea un dígito entre el 0 y el 10 ambos inclusive.
// También permite que esté vacío
export function validarNumero10(num) {
    if (num === "") return true;
    return Number.isInteger(num) && num >= 0 && num <= 10;
}
