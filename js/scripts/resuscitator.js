waitForTag(resuscitatorInit);

function resuscitatorInit() {
    lpTag.external = lpTag.external || {};
    lpTag.external.resuscitator = {
        start: function () {
            this._mStateBind = lpTag.events.bind('lp_SMT', 'MONITORING_STATE', this._mStateCallback.bind(this))
            this._mReqErrorBind = lpTag.events.bind('lp_SMT', 'MONITORING_REQUEST_ERROR', this._mReqErrorCallback.bind(this))
            if (!lpTag.taglets.lp_SMT.isActive()) lpTag.external.resuscitator.restartMonitoring();
            console.log(`${new Date().toLocaleTimeString()} - Resuscitator started`)
        },

        stop: function () {
            if (this._mStateBind) { lpTag.events.unbind(this._mStateBind); delete this._mStateBind }
            if (this._mReqErrorBind) { lpTag.events.unbind(this._mReqErrorBind); delete this._mReqErrorBind }
            this._unBindEvents()
            console.log(`${new Date().toLocaleTimeString()} - Resuscitator stopped`)
        },

        restartMonitoring: function () {
            lpTag.taglets.lp_SMT.reinit(lpTag.taglets.lp_SMT.inspect().conf);
            lpTag.taglets.lp_monitoringSDK.reinit(lpTag.taglets.lp_monitoringSDK.inspect().conf);
            lpTag.taglets.lp_SMT.start();
            this._unBindEvents()
            console.log(`${new Date().toLocaleTimeString()} - Montirong restarted`)
        },

        _mReqErrorCallback: function ({ error }) {
            console.log(`${new Date().toLocaleTimeString()} - Monitoring error: ${error}`);
            if (error === 44) this._bindEvents()
        },

        _mStateCallback: function ({ active }) {
            console.log(`${new Date().toLocaleTimeString()} - Monitoring: ${active}`);
            if (active) this._unBindEvents()
        },

        _activityCallback: function () {
            console.log(`${new Date().toLocaleTimeString()} - Activity detected`)
            if (!lpTag.taglets.lp_SMT.isActive()) lpTag.external.resuscitator.restartMonitoring();
        },

        _bindEvents: function () {
            if (!this._boundToEvents) {
                this._eventTypes.forEach(et => {
                    et.element.addEventListener(et.event, this._activityCallback, {once: true});
                })
                this._boundToEvents = true
                console.log(`${new Date().toLocaleTimeString()} - Waiting for activity`)
            }
        },

        _unBindEvents: function () {
            if (this._boundToEvents) {
                this._eventTypes.forEach(et => {
                    et.element.removeEventListener(et.event, this._activityCallback, false);
                })
                this._boundToEvents = false
                console.log(`${new Date().toLocaleTimeString()} - Unbound activity monitoring callbacks`)
            }
        },

        _eventTypes: [
            {element: document, event: 'click'},
            {element: document, event: 'mousemove'},
            {element: document, event: 'wheel'},
            {element: document, event: 'keydown'},
            {element: document, event: 'touchmove'},
            {element: window, event: 'scroll'},
            {element: window, event: 'focus'}
        ],

        _boundToEvents: false
    }
    lpTag.external.resuscitator.start();
}


