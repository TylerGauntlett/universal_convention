var app = new Vue({
    el: '#app',
    data: {
        input: 'some_sample_text,\nmore_text,',
        supportedTypes: [
            'snake',
            'camel',
            'pascal',
            'kebab'
        ],
        outputType: 'kebab',
        outputCase: 'upper'
    },
    methods: {
        detectType(type) {
            // TODO
            switch (type) {
                case 'snake':
                    return RegExp('(.*?)_([a-zA-Z])').test(this.input)
                case 'camel':
                    return false
                case 'pascal':
                    return RegExp('([A-Z][a-z0-9]+)+').test(this.input)
                case 'kebab':
                    return RegExp('(.*?)-([a-zA-Z])').test(this.input)
            }
        },
        normalize(word) {
            switch (this.inputType) {
                case 'snake':
                    return word
                        .split('_')
                case 'camel':
                    // TODO: Fix this
                    return this.normalized
                        .map((word, index) => index === 0 ? word : _.upperFirst(word))
                        .join()
                case 'pascal':
                    // TODO: Fix this
                    return word.match(RegExp('([A-Z][a-z0-9]+)+'))
                case 'kebab':
                    return word
                        .split('-')
            }
        },
        normalizedToOutput() {
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
                    console.log(this.normalized)
                    return _.chain(this.normalized)
                        .map(words => words.map(word => _.upperFirst(word)).join(''))
                        .value()

                case 'kebab':
                    return _.chain(this.normalized)
                        .map(words => this.applyCase(words.join('-')))
                        .value()
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
            this.input = this.output
        }
    },
    computed: {
        inputDelimiter() {
            return ',\n'
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
        normalized() {
            if (!this.isValid) {
                return []
            }

            return _.chain(this.input.split(this.inputDelimiter))
                .map(words => this.normalize(words).map(fragment => fragment.toLowerCase().trim()))
                .value();
        },
        output() {
            if (!this.isValid) {
                return ''
            }

            return this.normalizedToOutput().join(this.inputDelimiter);
        },
        canApplyCase() {
            if (!this.isValid) {
                return false
            }

            return _.includes(['snake', 'kebab'], this.outputType)
        }
    },
    mounted() {

    }
})