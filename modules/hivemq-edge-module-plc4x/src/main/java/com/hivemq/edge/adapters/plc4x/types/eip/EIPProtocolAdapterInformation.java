/*
 * Copyright 2023-present HiveMQ GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.hivemq.edge.adapters.plc4x.types.eip;

import com.hivemq.edge.modules.adapters.ProtocolAdapterConstants;
import com.hivemq.edge.modules.adapters.impl.AbstractProtocolAdapterInformation;
import com.hivemq.edge.modules.api.adapters.ProtocolAdapterCapability;
import com.hivemq.edge.modules.api.adapters.ProtocolAdapterInformation;
import com.hivemq.extension.sdk.api.annotations.NotNull;

import java.util.List;

/**
 * @author HiveMQ Adapter Generator
 */
public class EIPProtocolAdapterInformation
    extends AbstractProtocolAdapterInformation {

    public static final ProtocolAdapterInformation INSTANCE = new EIPProtocolAdapterInformation();

    protected EIPProtocolAdapterInformation() {
    }

    @Override
    public @NotNull String getProtocolName() {
        return "Ethernet/IP CIP";
    }

    @Override
    public @NotNull String getProtocolId() {
        return "ethernet-ip";
    }

    @Override
    public @NotNull String getDisplayName() {
        return "Ethernet IP to MQTT Protocol Adapter";
    }

    @Override
    public @NotNull String getDescription() {
        return "Connects HiveMQ Edge to Rockwell / Allen-Bradley ControlLogix and CompactLogix devices supporting Ethernet IP, reading data from the PLC into MQTT.";
    }

    @Override
    public String getVersion() {
        return super.getVersion() + " (BETA)";
    }

    @Override
    public String getLogoUrl() {
        return "/images/eip-icon.png";
    }

    @Override
    public ProtocolAdapterConstants.CATEGORY getCategory() {
        return ProtocolAdapterConstants.CATEGORY.INDUSTRIAL;
    }

    @Override
    public List<ProtocolAdapterConstants.TAG> getTags() {
        return List.of(ProtocolAdapterConstants.TAG.TCP,
                ProtocolAdapterConstants.TAG.AUTOMATION,
                ProtocolAdapterConstants.TAG.IIOT,
                ProtocolAdapterConstants.TAG.FACTORY);
    }

    @Override
    public byte getCapabilities() {
        return ProtocolAdapterCapability.READ;
    }

}
