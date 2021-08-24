function initAssisted () {
    lpTag.external = lpTag.external || {};
    lpTag.external.assistedalyzer = {
        assisted: false,
        counts: {},
        determinations: {},
        callback: function (data) {
            let assistedalyzer = lpTag.external.assistedalyzer
            // abort if we have already made the final "assisted" determination
            if (assistedalyzer.assisted) return;

            data.data.lines.forEach(line => {
                // skip line if this conversation has already been determined to be assisted
                if (assistedalyzer.counts[line.convId] && assistedalyzer.counts[line.convId].assisted) return;
                // skip lines from history
                if (line.history) return;
                // skip system messages
                if (line.source === 'system') return;
                // this will only mark a conversation as assisted if 4x4 lines have been READ (not just sent)
                if (line.state !== 'READ') return;

                // we'll count lines from each participant for each conversationId
                assistedalyzer.counts[line.convId] = assistedalyzer.counts[line.convId] || {};
                assistedalyzer.counts[line.convId][line.originatorId] = assistedalyzer.counts[line.convId][line.originatorId] || 0;
                assistedalyzer.counts[line.convId][line.originatorId] += 1;

                // keep track of the last conversation in the transcript, in case there are several
                assistedalyzer.lastConv = line.convId

                // keep track of the last agent in each conversation
                if (line.source === 'visitor') assistedalyzer.visistorId = line.originatorId
                else if (line.source === 'agent') assistedalyzer.lastAgent = line.originatorId

                // determine whether this conversation is assisted
                if (assistedalyzer.counts[line.convId][assistedalyzer.visistorId] > 3 && assistedalyzer.counts[line.convId][assistedalyzer.lastAgent] > 3) {
                    assistedalyzer.determinations[line.convId] = assistedalyzer.determinations[line.convId] || {}
                    assistedalyzer.determinations[line.convId][assistedalyzer.lastAgent] = {
                        assisted: true,
                        time: line.time
                    }
                }
            })

            // surveys show up with a conversationId that is not a uuid, so there are no hyphens
            if (assistedalyzer.counts[assistedalyzer.lastConv].assisted && assistedalyzer.lastConv.indexOf('-') > -1) {

            }
        },
        reportAssisted: function () {
            console.log('assisted!')
            assistedalyzer.assisted = true;
        }
    };

    lpTag.hooks.push({
      name: 'AFTER_GET_LINES',
      callback: lpTag.external.assistedalyzer.callback
    })
}

waitForTag(initAssisted);