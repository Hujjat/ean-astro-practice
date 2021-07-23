<template>
    <div class="position-relative">
        <div class="code__render" v-init-code><slot></slot></div>
        <a href="javascript:" class="code__toggle" @click="isOpen = !isOpen">
            {{isOpen ? 'Hide' : 'Show'}} HTML
            <span>{{ isOpen ? '-' : '+' }}</span>
        </a>

        <collapse-transition>
            <div v-show="isOpen">
                <pre><code class="html"></code></pre>
            </div>
        </collapse-transition>
    </div>
</template>

<script>
/*
* Code Vue component
* ---
* Example usage:
*
* Single line
* <ma-code>...</ma-code>
*
* Multi line - Add <pre> to preserve line breaks and indents
* <ma-code>
*   <pre>...</pre>
* </ma-code>

* Liquid
* <ma-code raw-code="{% raw %}{{ liquid_var }}{% endraw %}">
*   ...    
* </ma-code>
*/

import {CollapseTransition} from 'vue2-transitions';

import hljs from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';
import 'highlight.js/styles/vs2015.css';

hljs.registerLanguage('xml', xml);

export default {
    components: {
        CollapseTransition
    },

    directives: {
        initCode: {
            inserted(el, binding, vnode) {
                if (vnode.context.rawCode) {
                    el.parentNode.querySelector('code').innerText = vnode.context.rawCode;

                } else {
                    let code = el.querySelector('pre');

                    if (code) { // If multi line i.e. wrapped in <pre>
                        // First node would be spaces, assuming HTML is correctly indented
                        let spaces = code.childNodes[0].textContent;
                        code = code.innerHTML;

                        // Replace parent indents for display purposes
                        if (/\s{2,}/.test(spaces)) {
                            let regex = new RegExp(spaces, 'g');
                            code = code.replace(regex, '');
                        }

                        el.innerHTML = code;
                        el.parentNode.querySelector('code').innerText = code.trim();

                    } else {
                        el.parentNode.querySelector('code').innerText = el.innerHTML.trim();
                    }
                }
            }
        }
    },

    props: {
        rawCode: String
    },

    data() {
        return {
            isOpen: false
        }
    },

    mounted() {
        hljs.initHighlightingOnLoad();
    }
}
</script>

<style lang="scss">
.code__render {
    max-width: calc(100% - 10em);
    margin-bottom: 1em;
}

.code__toggle {
    position: absolute;
    top: 0;
    right: 0;
}

pre {
    margin: 0;
    font-size: 1em;
    letter-spacing: .05em;
}
</style>
