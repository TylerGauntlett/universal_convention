Vue.component('Editor', {
    template: '<div :id="editorId" style="width: 100%; height: 100%;"></div>',
    props: ['editorId', 'content'],
    data() {
        return {
            editor: Object,
            beforeContent: ''
        }
    },
    watch: {
        'content'(value) {
            if (this.beforeContent !== value) {
                this.editor.setValue(value, 1)
            }
        }
    },
    mounted() {
        let themes = [
            'ambiance',
            'chaos',
            'chrome',
            'clouds',
            'clouds_midnight',
            'cobalt',
            'crimson_editor',
            'dawn',
            'dracula',
            'dreamweaver',
            'eclipse',
            'github',
            'gob',
            'gruvbox',
            'idle_fingers',
            'iplastic',
            'katzenmilch',
            'kr_theme',
            'kuroir',
            'merbivore',
            'merbivore_soft',
            'mono_industrial',
            'monokai',
            'pastel_on_dark',
            'solarized_dark',
            'solarized_light',
            'sqlserver',
            'terminal',
            'textmate',
            'tomorrow',
            'tomorrow_night',
            'tomorrow_night_blue',
            'tomorrow_night_bright',
            'tomorrow_night_eighties',
            'twilight',
            'vibrant_ink',
            'xcode'
        ]

        const lang = 'text'
        const theme = 'tomorrow_night'

        this.editor = window.ace.edit(this.editorId)
        this.editor.setValue(this.content, 1)

        this.editor.getSession().setMode(`ace/mode/${lang}`)
        this.editor.setTheme(`ace/theme/${theme}`)

        this.editor.on('change', () => {
            this.beforeContent = this.editor.getValue()
            this.$emit('change-content', this.editor.getValue())
        })
    }
})

var app = new Vue({
    el: '#app',
    data: {
        input: 'some_sample_text\nmore_text\neven_more_text',
        supportedTypes: [
            'snake',
            'camel',
            'pascal',
            'kebab'
        ],
        outputType: 'camel',
        outputCase: 'lower'
    },
    methods: {
        detectType(type) {
            let words = this.input.split(this.inputDelimiter)

            let isSnake = words.every(word => word && (word === _.snakeCase(word) || word === _.snakeCase(word).toUpperCase()))
            let isCamel = words.every(word => word && word === _.camelCase(word))
            let isPascal = words.every(word => word && word === _.upperFirst(_.camelCase(word)) && _.startsWith(word, word[0].toUpperCase()))
            let isKebab = words.every(word => word && (word === _.kebabCase(word) || word === _.kebabCase(word).toUpperCase()))

            switch (type) {
                case 'snake':
                    return isSnake
                case 'camel':
                    return isCamel
                case 'pascal':
                    return isPascal
                case 'kebab':
                    return isKebab
            }
        },
        normalize(word) {
            switch (this.inputType) {
                case 'snake':
                    return word
                        .split('_')
                case 'camel':
                case 'pascal':
                    return word.split(/(?=[A-Z])/)
                case 'kebab':
                    return word
                        .split('-')
            }
        },
        applyCase(word) {
            if (!this.canApplyCase) {
                return
            }

            switch (this.outputCase) {
                case 'upper':
                    return word.toUpperCase()
                case 'lower':
                    return word.toLowerCase()
            }
        },
        swap() {
            let types = _.keys(this.inputState)
            // Get index of the current input type
            let index = _.indexOf(types, this.inputType)

            // Update input
            this.input = this.output

            // Set the new output type as the old input type
            this.outputType = types[index]
        },
        changeInput(val) {
            if (this.input !== val) {
                this.input = val
            }
        }
    },
    watch: {
        isValid(valid) {
            if (!valid) {
                console.log(this.inputState)
            }
        }
    },
    computed: {
        inputDelimiter() {
            return '\n'
        },
        inputType() {
            if (!this.isValid) {
                return null
            }

            return _.chain(this.inputState)
                .pickBy(state => state)
                .keys()
                .head()
                .value()
        },
        inputState() {
            return {
                snake: this.detectType('snake'),
                camel: this.detectType('camel'),
                pascal: this.detectType('pascal'),
                kebab: this.detectType('kebab'),
            }
        },
        isValid() {
            // Only one state can be active
            let oneActive = _.filter(this.inputState, state => state).length === 1

            // Ensures there is a valid delimiter
            let containsDelimiter = _.includes(this.input, this.inputDelimiter)

            return oneActive && containsDelimiter
        },
        constructedOutput() {
            switch (this.outputType) {
                case 'snake':
                    return _.chain(this.normalized)
                        .map(words => this.applyCase(words.join('_')))
                        .value()
                case 'camel':
                    return _.chain(this.normalized)
                        .map(words => words.map((word, index) => index === 0 ? word : _.upperFirst(word)).join(''))
                        .value()

                case 'pascal':
                    return _.chain(this.normalized)
                        .map(words => words.map(word => _.upperFirst(word)).join(''))
                        .value()

                case 'kebab':
                    return _.chain(this.normalized)
                        .map(words => this.applyCase(words.join('-')))
                        .value()
            }
        },
        normalized() {
            if (!this.isValid) {
                return []
            }

            // Sanitize each row by exploding on delimiter
            // and lower casing every word. keep it in array form
            return _.chain(this.input.split(this.inputDelimiter))
                .map(words => this.normalize(words).map(fragment => fragment.toLowerCase().trim()))
                .value();
        },
        output() {
            if (!this.isValid) {
                return ''
            }

            return this.constructedOutput.join(this.inputDelimiter);
        },
        canApplyCase() {
            if (!this.isValid) {
                return false
            }

            return _.includes(['snake', 'kebab'], this.outputType)
        }
    }
})