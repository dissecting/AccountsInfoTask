public with sharing class AccountsInfoController {

    @AuraEnabled
    public static AccountsWithFields getAccountList(Integer pageSize, Integer pageNumber) {

        String soql = 'SELECT ';
        List<Schema.FieldSetMember> fieldSet = SObjectType.Account.FieldSets.AccountFieldSet.getFields();
        List<String> fieldSetNameList = new List<String>();
        List<String> nameUpdateableList = new List<String>();
        List<String> fieldSetTypeList = new List<String>();
        List<String> fieldSetLabelList = new List<String>();

        for (Schema.FieldSetMember f : fieldSet) {
            if (!f.getFieldPath().contains('.')) {
                fieldSetNameList.add(f.getFieldPath());
                fieldSetTypeList.add(String.valueOf(f.getType()));
                fieldSetLabelList.add(f.getLabel());
                Schema.DescribeFieldResult describeFieldResult =
                    Schema.getGlobalDescribe().get('Account').getDescribe().fields.getMap().get(f.getFieldPath()).getDescribe();
                if (describeFieldResult.isUpdateable()) {
                    nameUpdateableList.add(f.getFieldPath());
                }
            }
        }

        if (!fieldSetNameList.contains('Name')) {
            fieldSetNameList.add(0, 'Name');
            fieldSetTypeList.add(0, 'TEXT');
            fieldSetLabelList.add(0, 'Account Name');
            nameUpdateableList.add(0, 'Name');
        }

        soql += String.join(fieldSetNameList, ', ');
        soql += ' FROM Account ORDER BY CreatedDate DESC';

        ApexPages.StandardSetController setCtrl = new ApexPages.StandardSetController(Database.getQueryLocator(soql));
        setCtrl.setPageSize(pageSize);
        setCtrl.setpageNumber(pageNumber);

        AccountsWithFields accountsWithFields = new AccountsWithFields();
        accountsWithFields.accountFieldTypes = fieldSetTypeList;
        accountsWithFields.accountFields = fieldSetNameList;
        accountsWithFields.accountColumns = fieldSetLabelList;
        accountsWithFields.accountUpdateableColumns = nameUpdateableList;
        accountsWithFields.accounts = setCtrl.getRecords();
        accountsWithFields.accountCount = setCtrl.getResultSize();

        return accountsWithFields;
    }

    public class AccountsWithFields {

        @AuraEnabled
        public List<Account> accounts { get; set; }
        @AuraEnabled
        public List<String> accountFields { get; set; }
        @AuraEnabled
        public List<String> accountColumns { get; set; }
        @AuraEnabled
        public List<String> accountUpdateableColumns { get; set; }
        @AuraEnabled
        public List<String> accountFieldTypes { get; set; }
        @AuraEnabled
        public Integer accountCount { get; set; }

        public AccountsWithFields() {
            this.accounts = new List<Account>();
            this.accountFields = new List<String>();
            this.accountColumns = new List<String>();
            this.accountUpdateableColumns = new List<String>();
            this.accountFieldTypes = new List<String>();
        }
    }
}