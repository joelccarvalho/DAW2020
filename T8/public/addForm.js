function addFormUpload() {

    var newUpload = $(`
                        <div class="w3-row w3-margin-bottom">
                            <div class="w3-col s3">
                                <hr style="border-top: 2px dashed #009688;"/>
                                <label class="w3-text-teal"><b>Description</b></label>
                                <input class="w3-input w3-border w3-light-grey" type="text" name="desc">
                            </div>
                        </div>
                        <div class="w3-row w3-margin-bottom">
                            <div class="w3-col s3">
                                <label class="w3-text-teal"><b>Select file</b></label>
                            </div>
                        </div>
                        <div class="w3-col s9">
                            <input class="w3-input w3-border w3-light-grey" type="file" name="myFiles">
                        </div>
                    `)

    $("#newUpload").append(newUpload)
}