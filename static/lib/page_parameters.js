var page_parameters = {

    MenuData: [],

    GetURL: function (MID) {

        for (var i = 0; i < this.MenuData.length; i++) {

            if (this.MenuData[i].ModuleId == MID) {

                return this.MenuData[i].UrlAddress + '?MID=' + this.MenuData[i].ModuleId;

            }
        }

        return '#';
    },

    GetMID: function (URL) {

        for (var i = 0; i < this.MenuData.length; i++) {

            if (this.MenuData[i].UrlAddress == URL) {

                return this.MenuData[i].ModuleId;
            }
        }

        return '#';
    },

    Caching: [],

    GetParameters: function (URL) {

        var temp;

        for (var i = 0; i < this.Caching.length; i++) {

            if (this.Caching[i].URL == URL) {

                temp = this.Caching[i].Parameters;

                this.Caching.splice(i, 1);

                break;
            }
        }

        return temp;
    }
};

